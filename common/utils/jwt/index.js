import jwt from 'jsonwebtoken';

export const generateToken = (user, expiresIn) => {
    const JWT_SECRET = process.env.JWT_SECRET || 'secret';
    const JWT_EXPIRES_IN = expiresIn || process.env.JWT_EXPIRES_IN || '24h';
    if (!user) return null;

    if(user.password) delete user.password;
    
    return jwt.sign(
        { userId: user.id }, 
        JWT_SECRET, 
        { expiresIn: JWT_EXPIRES_IN }
    );
};