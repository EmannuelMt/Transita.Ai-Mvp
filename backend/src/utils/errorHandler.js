function handleError(res, error) {
    console.error(error);
    const message = error.message || 'Erro interno do servidor';
    res.status(500).json({ message });
}

module.exports = { handleError };
