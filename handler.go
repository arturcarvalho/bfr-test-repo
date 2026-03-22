package testfiles

import (
	"encoding/json"
	"net/http"
)

type Response struct {
	Status  string      `json:"status"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	resp := Response{
		Status:  "ok",
		Message: "Service is running",
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func notFoundHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusNotFound)
	resp := Response{
		Status:  "error",
		Message: "Resource not found",
	}
	json.NewEncoder(w).Encode(resp)
}
