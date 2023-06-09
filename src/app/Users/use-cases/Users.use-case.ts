import { RequestHandler, Request, Response } from "express";
import { knexInstance as query } from "../../../infrastructure/MySQL/ConnetDB.services";
import { User, FullUser } from "../domain/Users.d";
import { hashPassword } from "../../../share/Crypt.services";

// Returns all the users
export const UsersGet: RequestHandler = async (_req: Request, res: Response) => {
  try {
    const sqlQuery = await query('users')
      .select('user_id', 'first_name', 'last_name', 'email', 'role', 'created_at', 'updated_at', 'company_id', 'professional_id') as User[];
    return res.json(sqlQuery);
  } catch(error) {
    console.error('Failed to get users:', error);
    return res.status(500).json({ message: 'Failed to get users' });
  }
};

// Returns the user with the given user_id
export const UserGetById: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    const sqlQuery = await query('users')
      .select('user_id', 'first_name', 'last_name', 'email', 'role', 'created_at', 'updated_at', 'company_id', 'professional_id')
      .where('user_id', user_id)
      .first() as User;
    if (!sqlQuery) {
      return res.status(404).json({ message: 'User id not found' });
    }
    return res.json(sqlQuery);
  } catch (error) {
    console.error('Failed to get user:', error);
    return res.status(500).json({ message: 'Failed to get user' });
  }
};

// POST endpoint to create an user
export const UserPost: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { first_name, last_name, email, password, role, company_id = null, professional_id = null } = req.body;

    // Number of salt rounds (higher is safer but slower)
    const hashedPassword = await hashPassword(password);

    const sqlQuery = await query('users')
      .insert({ first_name, last_name, email, password_hash: hashedPassword, role, company_id, professional_id });
    const insertedUserId = sqlQuery[0];

    const createdUser = await query('users')
      .select('user_id', 'first_name', 'last_name', 'email', 'role', 'created_at', 'updated_at', 'company_id', 'professional_id')
      .where('user_id', insertedUserId)
      .first() as User;

    return res.status(201).json(createdUser);
  } catch (error) {
    console.error('Failed to create user:', error);
    return res.status(500).json({ message: 'Failed to create user' });
  }
};

// PUT endpoint to update an user
export const UserPut: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    const { first_name, last_name, email, password, role } = req.body;

    let hashedPassword: string | undefined = undefined;
    if (password !== undefined) {
      hashedPassword = await hashPassword(password);
    }

    const updateData: Partial<FullUser> = { first_name, last_name, email, role };
    if (hashedPassword !== undefined) {
      updateData.password_hash = hashedPassword;
    }

    const sqlQuery = await query('users')
      .where('user_id', user_id)
      .update(updateData);

    const affectedRows = sqlQuery;
    if (!affectedRows) {
      return res.status(404).json({ message: 'User not found' });
    } else {
      const updatedUser = await query('users')
        .select('user_id', 'first_name', 'last_name', 'email', 'role', 'created_at', 'updated_at', 'company_id', 'professional_id')
        .where('user_id', user_id)
        .first() as User;
      return res.json(updatedUser);
    }
  } catch (error) {
    console.error('Failed to update user:', error);
    return res.status(500).json({ message: 'Failed to update user' });
  }
};

// DELETE endpoint to delete an user
export const UserDelete: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    const sqlQuery = await query('users')
      .where('user_id', user_id)
      .del();

    const deletedRows = sqlQuery;
    if (!deletedRows) {
      return res.status(404).json({ message: 'User not found' });
    } else {
      return res.status(204).json();
    }
  } catch (error) {
    console.error('Failed to delete user:', error);
    return res.status(500).json({ message: 'Failed to delete user' });
  }
};
