from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
from starlette import status


def register_exception_handlers(app):
    @app.exception_handler(HTTPException)
    async def http_exception_handler(request: Request, exc: HTTPException):
        detail = exc.detail if isinstance(exc.detail, str) else str(exc.detail)
        request_id = getattr(request.state, "request_id", None)
        return JSONResponse(
            status_code=exc.status_code,
            content={"ok": False, "detail": detail, "errorCode": f"HTTP_{exc.status_code}", "requestId": request_id},
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception):
        request_id = getattr(request.state, "request_id", None)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"ok": False, "detail": str(exc), "errorCode": "INTERNAL_ERROR", "requestId": request_id},
        )
