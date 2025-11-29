const admin = require('firebase-admin');
const userService = require('../services/userService');

const auth = async (req, res, next) => {
    try {
        console.log('Auth Middleware: Verificando requisição para:', req.path);
        console.log('Auth Middleware: Headers:', {
            ...req.headers,
            authorization: req.headers.authorization ?
                `${req.headers.authorization.substring(0, 20)}...` : 'ausente'
        });

        const token = req.headers.authorization?.split('Bearer ')[1];

        if (!token) {
            console.log('Auth Middleware: Token não fornecido');
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        console.log('Auth Middleware: Verificando token com Firebase...');
        const decodedToken = await admin.auth().verifyIdToken(token);

        // procurar usuário no Realtime DB pelo firebaseUid; se não existir, criar onboarding
        let user = await userService.getByFirebaseUid(decodedToken.uid);
        if (!user) {
            user = await userService.createFromDecoded(decodedToken);
        }

        // Força isAdmin para superadministrador ao criar novo usuário
        if (!user && decodedToken.email === 'transitaaipro@gmail.com') {
            console.log('Criando superadministrador automaticamente...');
            user = await userService.createFromDecoded({
                ...decodedToken,
                isAdmin: true
            });
        }

        // Nota: usamos firebaseUid como id (string) no novo esquema
        req.user = {
            id: decodedToken.uid,
            firebaseUid: decodedToken.uid,
            email: decodedToken.email
        };

        console.log('Auth Middleware: Usuário autenticado:', {
            id: decodedToken.uid,
            firebaseUid: decodedToken.uid,
            email: decodedToken.email,
            isAdmin: user.isAdmin
        });
        console.log('Auth Middleware: Valor de isAdmin no banco:', user.isAdmin);

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        console.error('Stack trace:', error.stack);
        res.status(401).json({
            message: 'Token inválido',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = auth;