const jwt = require('jsonwebtoken');

exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: 'refresh token not found' });
    }

    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'invalid refresh token' });
      }

      const newAccessToken = jwt.sign(
        {
          userId: decoded.userId,
          email: decoded.email,
          role: decoded.role
        },
        process.env.ACCESS_SECRET,
        { expiresIn: "15m" }
      );

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        sameSite: 'strict',
        secure: false // local dev
      });

      return res.status(200).json({ message: "Access token refreshed" });
    });

  } catch (error) {
    

    return res.status(500).json({ message: error.message });
  }
}
