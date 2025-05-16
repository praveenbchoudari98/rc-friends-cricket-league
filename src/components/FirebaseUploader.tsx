import React, { useRef, useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export default function RestoreFirestore() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [logs, setLogs] = useState<string[]>([]);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const text = await file.text();
            const data = JSON.parse(text);

            setLogs((prev: string[]) => [...prev, "Starting restore..."]);

            for (const docData of data) {
                // Assuming each doc has an 'id' field for the document ID
                const { id, ...restData } = docData as { id: string };

                if (!id) {
                    setLogs((prev: string[]) => [...prev, `❌ Skipping document without ID`]);
                    continue;
                }

                await setDoc(doc(db, 'tournaments', id), restData);
                setLogs((prev: string[]) => [...prev, `Restored tournaments/${id}`]);
            }

        } catch (error) {
            console.error("Restore failed:", error);
            setLogs((prev: string[]) => [...prev, `❌ Restore failed: ${(error as Error).message}`]);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "20px auto", fontFamily: "Arial, sans-serif" }}>
            <button
                onClick={handleButtonClick}
                style={{
                    padding: "12px 24px",
                    fontSize: "16px",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
            >
                Restore Firestore from JSON
            </button>

            <input
                type="file"
                accept=".json,application/json"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
            />

            <div style={{ marginTop: 20, maxHeight: 200, overflowY: "auto", backgroundColor: "#f9f9f9", padding: 10, borderRadius: 6 }}>
                <strong>Logs:</strong>
                <ul>
                    {logs.map((log, i) => (
                        <li key={i} style={{ fontSize: 14, margin: "4px 0" }}>
                            {log}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
