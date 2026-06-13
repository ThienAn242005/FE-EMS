import { useEffect, useRef, useCallback } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

export const useWebSocket = (studentCode) => {
    const stompClientRef = useRef(null);

    const connect = useCallback(() => {
        if (!studentCode) return;

        // Phải khớp với Endpoint ông đặt ở Spring Boot WebSocketConfig
        const socket = new SockJS("http://localhost:8080/ws-sms");
        const client = Stomp.over(socket);

        // Tắt log loằng ngoằng của Stomp trên Console cho sạch
        client.debug = () => {}; 

        client.connect({}, () => {
            console.log("WebSocket Connected: " + studentCode);
            stompClientRef.current = client;
        }, (err) => {
            console.error("WebSocket Error: ", err);
            // Tự động kết nối lại sau 5 giây nếu sập
            setTimeout(connect, 5000); 
        });
    }, [studentCode]);

    useEffect(() => {
        connect();
        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.disconnect();
            }
        };
    }, [connect]);

    // Hàm để đăng ký lắng nghe ở bất kỳ trang nào
    const subscribe = (topic, callback) => {
        if (stompClientRef.current && stompClientRef.current.connected) {
            return stompClientRef.current.subscribe(topic, (msg) => {
                callback(JSON.parse(msg.body));
            });
        }
    };

    return { subscribe };
};