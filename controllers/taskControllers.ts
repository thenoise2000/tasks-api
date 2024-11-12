import { Request, Response, NextFunction } from "express";
import Task from "../models/taskModel";
import * as Joi from "joi";
import { sendResponse } from "../utils";
import db from "./../firebase";
import { Timestamp } from "firebase-admin/firestore";

const taskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
});

// Función para manejar errores
const handleError = (error: unknown, next: NextFunction) => {
  const err = error as Error;
  next(new Error(err.message));
};

// Función para crear una nueva tarea
export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const { error } = taskSchema.validate(data);
    if (error) throw new Error(error.details[0].message);

    const taskData = {
      ...data,
      isCompleted: false,
      createdAt: Timestamp.now(),
    };
    await db.collection("tasks").add(taskData);
    sendResponse(res, 201, null, "Task created");
  } catch (error) {
    handleError(error, next);
  }
};

// Función para obtener todas las tareas
export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const snapshot = await db.collection("tasks").get();
    const tasks: Task[] = snapshot.docs.map(doc => {
      const data = doc.data();
      return new Task(doc.id, data.title, data.description, data.createdAt, data.isCompleted);
    });
    sendResponse(res, 200, tasks, "Tasks sent");
  } catch (error) {
    handleError(error, next);
  }
};

// Función para obtener una tarea específica
export const getTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const data = await db.collection("tasks").doc(id).get();
    if (data.exists) {
      sendResponse(res, 200, data.data(), "Task sent");
    } else {
      sendResponse(res, 404, null, "Task not found");
    }
  } catch (error) {
    handleError(error, next);
  }
};

// Función para actualizar una tarea
export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const { error } = taskSchema.validate(data);
    if (error) throw new Error(error.details[0].message);

    const taskRef = db.collection("tasks").doc(id);
    const taskSnapshot = await taskRef.get();
    if (!taskSnapshot.exists) {
      sendResponse(res, 404, null, "Task not found");
      return;
    }

    await taskRef.update(data);
    sendResponse(res, 200, null, "Task updated");
  } catch (error) {
    handleError(error, next);
  }
};

// Función para eliminar una tarea
export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const taskRef = db.collection("tasks").doc(id);
    const taskSnapshot = await taskRef.get();
    if (!taskSnapshot.exists) {
      sendResponse(res, 404, null, "Task not found");
      return;
    }

    await taskRef.delete();
    sendResponse(res, 200, null, "Task deleted");
  } catch (error) {
    handleError(error, next);
  }
};

// Función para marcar una tarea como completada
export const markTaskAsCompleted = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const taskRef = db.collection("tasks").doc(id);
    const taskSnapshot = await taskRef.get();
    if (!taskSnapshot.exists) {
      sendResponse(res, 404, null, "Task not found");
      return;
    }

    await taskRef.update({ isCompleted: true });
    sendResponse(res, 200, null, "Task marked as completed");
  } catch (error) {
    handleError(error, next);
  }
};

// Función para obtener tareas pendientes
export const getPendingTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tasksQuery = db.collection("tasks").where("isCompleted", "==", false).orderBy("createdAt", "asc");
    const tasksSnapshot = await tasksQuery.get();
    const taskArray: Task[] = tasksSnapshot.docs.map(doc => {
      const data = doc.data();
      return new Task(doc.id, data.title, data.description, data.createdAt, data.isCompleted);
    });
    sendResponse(res, 200, taskArray, "Pending tasks sent");
  } catch (error) {
    handleError(error, next);
  }
};