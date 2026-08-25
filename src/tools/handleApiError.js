export const handleApiError = (error, addError, fallback = 'An unexpected error occurred.') => {
    const data = error?.response?.data;

    if (!data) {
        addError(error?.message || fallback);
        return;
    }

    // ASP.NET validation errors: { errors: { field: ['msg'] } }
    if (data.errors) {
        Object.entries(data.errors).forEach(([field, messages]) => {
            messages.forEach((msg) => addError(`${field}: ${msg}`));
        });
        return;
    }

    // ASP.NET ProblemDetails: { detail, title }
    if (data.detail) { addError(data.detail); return; }
    if (data.title)  { addError(data.title);  return; }

    // Plain string
    if (typeof data === 'string') { addError(data); return; }

    addError(fallback);
};