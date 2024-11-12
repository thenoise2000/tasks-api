import { Request, Response, NextFunction } from "express";
import User from "../models/userModel";
import * as Joi from "joi";
import { sendResponse } from "../utils";
import db from "./../firebase";

const userSchema = Joi.object({
  email: Joi.string().email().required(),
});

// Función para manejar errores
const handleError = (error: unknown, next: NextFunction) => {
  const err = error as Error;
  next(new Error(err.message));
};

// Función para mapear documentos a instancias de User
const mapUserData = (doc: any): User => new User(doc.id, doc.data().email);

// Obtener todos los usuarios
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const usersSnapshot = await db.collection("users").get();
    const usersArray: User[] = usersSnapshot.docs.map(mapUserData);
    sendResponse(res, 200, usersArray, "Users sent");
  } catch (error) {
    handleError(error, next);
  }
};

// Crear un nuevo usuario
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;

    // Validar datos antes de procesar
    const { error } = userSchema.validate(data);
    if (error) {
      throw new Error(error.details[0].message);
    }

    const docRef = db.collection("users").doc(data.email);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      sendResponse(res, 400, null, "Email already exists");
      return;
    }

    await docRef.set(data);
    sendResponse(res, 201, null, "User created");
  } catch (error) {
    handleError(error, next);
  }
};

// Eliminar un usuario
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const userRef = db.collection("users").doc(id);
    const userSnapshot = await userRef.get();

    if (!userSnapshot.exists) {
      sendResponse(res, 404, null, "User not found");
      return;
    }

    await userRef.delete();
    sendResponse(res, 200, null, "User deleted");
  } catch (error) {
    handleError(error, next);
  }
};

// Obtener un usuario por correo electrónico
export const getUserByEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req.params.email;
    const usersRef = db.collection("users");
    const querySnapshot = await usersRef.where("email", "==", email).get();

    if (querySnapshot.empty) {
      sendResponse(res, 404, null, "User not found");
      return;
    }

    const user = querySnapshot.docs.map(mapUserData)[0];
    sendResponse(res, 200, user, "User sent");
  } catch (error) {
    handleError(error, next);
  }
};