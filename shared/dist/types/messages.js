/**
 * WebSocket message types for real-time communication
 * between Chrome Extension, Web App, and Backend
 */
export var MessageType;
(function (MessageType) {
    // Connection
    MessageType["CONNECT"] = "CONNECT";
    MessageType["DISCONNECT"] = "DISCONNECT";
    MessageType["PING"] = "PING";
    MessageType["PONG"] = "PONG";
    // Authentication
    MessageType["AUTH"] = "AUTH";
    MessageType["AUTH_SUCCESS"] = "AUTH_SUCCESS";
    MessageType["AUTH_FAILURE"] = "AUTH_FAILURE";
    // Document Operations
    MessageType["DOCUMENT_DETECTED"] = "DOCUMENT_DETECTED";
    MessageType["DOCUMENT_UPLOAD"] = "DOCUMENT_UPLOAD";
    MessageType["DOCUMENT_ANALYZE"] = "DOCUMENT_ANALYZE";
    MessageType["DOCUMENT_ANALYSIS_COMPLETE"] = "DOCUMENT_ANALYSIS_COMPLETE";
    MessageType["DOCUMENT_GENERATE"] = "DOCUMENT_GENERATE";
    MessageType["DOCUMENT_GENERATED"] = "DOCUMENT_GENERATED";
    MessageType["DOCUMENT_UPDATE"] = "DOCUMENT_UPDATE";
    MessageType["DOCUMENT_DELETE"] = "DOCUMENT_DELETE";
    // Risk Analysis
    MessageType["RISK_SCORE_UPDATE"] = "RISK_SCORE_UPDATE";
    MessageType["RISK_ALERT"] = "RISK_ALERT";
    // State Sync
    MessageType["STATE_SYNC"] = "STATE_SYNC";
    MessageType["STATE_REQUEST"] = "STATE_REQUEST";
    // Commands
    MessageType["COMMAND"] = "COMMAND";
    MessageType["COMMAND_RESULT"] = "COMMAND_RESULT";
    // Errors
    MessageType["ERROR"] = "ERROR";
})(MessageType || (MessageType = {}));
