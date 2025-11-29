// Mongo models removed — project uses Firebase Realtime Database (RTDB).
// This file is a stub to avoid requiring mongoose. Use the services in `src/services`.

module.exports = {
    __removed__: true,
    message: 'Mongo models removed. Use backend services in src/services/* to interact with Firebase Realtime Database.'
};
statusAssinatura: {
    type: String,
        enum: ['ativo', 'pendente', 'cancelado'],
        default: 'ativo'
},
dataInicioPlano: Date,
    dataRenovacao: Date,
        numeroConsultasMes: {
    type: Number,
        default: 0
},
limiteConsultasMes: {
    type: Number,
        default: 30
},
chaveAPI: String,
    isAdmin: {
    type: Boolean,
        default: false
},
dataCadastro: {
    type: Date,
        default: Date.now
}
}, {
    timestamps: true
});

// previously exported mongoose model; removed in migration to RTDB
