import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";


export const updatePassword = async (req, res) => {
    const userId= req.user.id;
    const { currentPassword, newPassword } = req.body;
     try {
        const user= await prisma.user.findUnique({
            where:{
                id: userId
            }
        })
        const isMatch= await bcrypt.compare(currentPassword, user.passwordHash);
        if(!isMatch){
            return res.status(400).json({ message: "Current password is incorrect." });
        }
        const salt= await bcrypt.genSalt(10);
        const newHashedPassword= await bcrypt.hash(newPassword, salt);
        await prisma.user.update({
            where:{
                id: userId
            },
            data:{
                passwordHash: newHashedPassword
            }
        })
        res.status(200).json({ message: "Password updated successfully." });
     } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({
            error: "An error occurred while updating the password.",
            details: error.message
        })
     }
}

export const updateTheme = async (req, res) =>{
    const userId= req.user.id;
    const { appTheme, appFont } = req.body;

    try {
        const updateTheme = await prisma.user.update({
            where:{
                id: userId
            },
            data:{
                appTheme: appTheme,
                appFont: appFont
            }
        })
        console.log(updateTheme);
        res.status(200).json({ message: "Theme updated successfully.", updateTheme
        })
    } catch (error) {
        console.error("Error updating theme:", error);
        res.status(500).json({
            error: "An error occurred while updating the theme.",
            details: error.message
        })
    }
}