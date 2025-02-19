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
        .populate({
          path: 'courses',  
          match: { status: true }, 
          select: 'name description',  
        })
        .populate({
          path: 'createdCourses',  
          match: { status: true }, 
          select: 'name description',  
        })
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




export const deleteUser = async (req, res) => {
  try {
      const { id } = req.params;
      const authenticatedUser = req.usuario;
      console.log("Authenticated user:", req.usuario);
      if (authenticatedUser.id !== id) {
          return res.status(403).json({
              success: false,
              msg: "You can only deactivate your own account"
          });
      }

      const user = await User.findByIdAndUpdate(id, { state: false }, { new: true });
      if (!user) {
          return res.status(404).json({
              success: false,
              msg: "User not found"
          });
      }
      res.status(200).json({
          success: true,
          msg: 'User deactivated',
          user,
          authenticatedUser
      });
  } catch (error) {
      res.status(500).json({
          success: false,
          msg: 'Error deactivating user',
          error
      });
  }
};
