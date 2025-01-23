import { useState, useEffect } from 'react';

// FlashMessage component to display success or error messages.
const FlashMessage = ({ flash }) => {
    const [visible, setVisible] = useState(!!flash.success || !!flash.error);

    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => setVisible(false), 3000); // หายไปหลัง 3 วินาที
            return () => clearTimeout(timer); // ล้าง timer เมื่อ component ถูก unmount หรือ flash เปลี่ยน
        }
    }, [visible]);


    if (!visible) return null; // ถ้าไม่มี flash message ให้ return null

    return (
        <div
            className={`${
                flash.success
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
            } mb-4 rounded border p-4`}
        >
            <p>{flash.success || flash.error}</p>
        </div>
    );
};

export default FlashMessage;
