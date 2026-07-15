import mongoose, { Schema } from 'mongoose';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const UserSchema = new Schema(
    {
        username : {
            type : String ,
            required : true,
            maxLength : 16,
            unique : true,
            trim : true,
        },
        fullname : {
            type : String ,
            required : true,
            maxLength : 50,
            trim : true,
        },
        password : {
            type : String , 
            required : false, // Not required for OAuth users
            trim : true,
            minLength : 8,
        },
        authProvider : {
            type : String,
            enum : ['local', 'github', 'google'],
            default : 'local'
        },
        githubId : {
            type : String,
            default : null
        },
        googleId : {
            type : String,
            default : null
        },
        email : {
            type : String ,
            required : true,
            unique : true,
            lowercase : true,
            trim : true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
        },
        profile_picture : {
            type : String ,
            default : null,
            trim : true,
        },
        role : {
            type : String ,
            enum : ['user' , 'admin'],
            default : 'user',
        },
        refreshToken : {
            type : String 
        },
        emailConfig : {
            service : {
                type : String,
                default : 'gmail'
            },
            user : {
                type : String,
                default : null
            },
            pass : {
                type : String,
                default : null
            },
            host : {
                type : String,
                default : null
            },
            port : {
                type : Number,
                default : null
            },
            secure : {
                type : Boolean,
                default : false
            }
        },
    },
    {
        timestamps : true
    }
)

// Indexes are automatically created from schema definitions with unique: true and index: true
// No need to explicitly define them here to avoid duplicate index warnings

// Compare password
UserSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate Access Token
UserSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
      fullname: this.fullname,
    },
    process.env.JWT_ACCESS_TOKEN,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    }
  );
};

// Generate Refresh Token
UserSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.JWT_REFRESH_TOKEN,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    }
  );
};

export const User = mongoose.model('User' , UserSchema);

