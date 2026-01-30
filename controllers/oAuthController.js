// controllers\oAuthController.js

const { generateAccessToken,generateRefreshToken } =require('../utils/token')


exports.googleCallback = async (req, res) => {
    try{

    const user = req.user;

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("accessToken", accessToken, {
        httpOnly: true
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true
    });

    return res.status(201).json({message : "google login succesfully"})
}catch(error){
    return res.status(500).json({message : error.message})
}

};
