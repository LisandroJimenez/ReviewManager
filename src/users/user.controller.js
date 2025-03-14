import { response } from "express";
import User from "./user.model.js";
import  argon2 from "argon2";

export const getUsers = async (req = request, res = response) => {
  try {
    const { limite = 10, desde = 0 } = req.query;
    const query = { state: true };

    const [total, users] = await Promise.all([
      User.countDocuments(query),
      User.find(query)
        .skip(Number(desde))
        .limit(Number(limite))

    ]);

    res.status(200).json({
      success: true,
      total,
      users
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error getting users",
      error
    });
  }
};



export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, password, oldPassword, email, ...data } = req.body;
        const authenticatedUser = req.usuario; 
        if (authenticatedUser.id !== id && !authenticatedUser.isAdmin) {
            return res.status(403).json({
                success: false,
                msg: 'You can only update your own profile or you must be an admin to update other users'
            });
        }
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: 'User not found'
            });
        }
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({
                    success: false,
                    msg: 'Email is already in use by another user'
                });
            }
            user.email = email;
        }
        if (password) {
            if (!oldPassword) {
                return res.status(400).json({
                    success: false,
                    msg: 'Old password is required to update password'
                });
            }
            const isMatch = await argon2.verify(user.password, oldPassword);
            if (!isMatch) {
                return res.status(400).json({
                    success: false,
                    msg: 'Old password is incorrect'
                });
            }
            user.password = await argon2.hash(password);
        }
        Object.assign(user, data);
        await user.save();
        res.status(200).json({
            success: true,
            msg: 'User updated successfully',
            user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: 'Error when updating user',
            error
        });
    }
};


export const createAdmin = async () => {
    try {
        const existAdmin = await User.findOne({ isAdmin: true });
        
        if (!existAdmin) {
            const hashed = await argon2.hash("admin12345678");
            const adminUser = new User({
                name: "Admin",
                surname: "dd",
                username: "admin",
                email: "admin@gmail.com",
                phone: "12345667",
                password: hashed,
                isAdmin: true
            });

            await adminUser.save();
            console.log("Admin user created successfully");
        } 
    } catch (error) {
        console.error("Error creating admin:", error);
    }
};
