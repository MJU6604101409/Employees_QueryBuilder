import { router } from '@inertiajs/react';
import { useState } from 'react';
import FlashMessage from '@/Components/FlashMessage';
import { usePage } from '@inertiajs/react';
// query = ค่าของการค้นหาที่ส่งกลับมาจาก Controller
// employees = ข้อมูลพนักงานที่ส่งกลับมาจาก controller
export default function Index({ employees }) {
    const [search, setSearch] = useState('');  // ตั้งค่า search เป็นค่าว่างเริ่มต้น
    const { flash } = usePage().props;

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/employees', { search }); // ส่งค่า search ไปยัง backend
    };



    return (
        <div
            style={{
                fontFamily: 'Arial, sans-serif',
                padding: '20px',
                backgroundColor: '#f9f9f9', // พื้นหลังสีเทาอ่อน
                minHeight: '100vh',
            }}

        >
            <FlashMessage flash={flash} />
            <h1
                style={{
                    color: '#4a4a4a', // สีเทาเข้ม
                    textAlign: 'center',
                    marginBottom: '20px',
                    fontSize: '2.5rem',
                    fontWeight: '500',
                }}
            >
                Employee List
            </h1>
            <form onSubmit={handleSearch} style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name"
                    style={{
                        padding: '10px',
                        width: '300px',
                        border: '1px solid #dcdcdc', // เส้นขอบสีเทาอ่อน
                        borderRadius: '5px',
                        marginRight: '10px',
                        backgroundColor: '#ffffff',
                    }}
                />
                <button
                    type="submit"
                    style={{
                        backgroundColor: '#4a4a4a', // ปุ่มสีเทาเข้ม
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    Search
                </button>
            </form>

            <table
                style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    marginBottom: '20px',
                    backgroundColor: '#ffffff', // สีพื้นหลังของตาราง
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // เพิ่มเงาเบา ๆ
                    tableLayout: 'fixed', // บังคับให้คอลัมน์มีความกว้างคงที่
                }}
            >
                <thead>
                    <tr style={{ backgroundColor: '#dcdcdc', color: '#4a4a4a' }}>
                        <th style={{ padding: '10px', border: '1px solid #e0e0e0' }}>ID</th>
                        <th style={{ padding: '10px', border: '1px solid #e0e0e0' }}>First Name</th>
                        <th style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Last Name</th>
                        <th style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Birthday</th>
                        <th style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Hire_Date</th>
                        <th style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Profile</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.data.map((employee) => (
                        <tr key={employee.emp_no}>
                            <td style={{ padding: '10px', border: '1px solid #f0f0f0', textAlign: 'center' }}>
                                {employee.emp_no}
                            </td>

                            <td style={{ padding: '10px', border: '1px solid #f0f0f0' }}>{employee.first_name}</td>
                            <td style={{ padding: '10px', border: '1px solid #f0f0f0' }}>{employee.last_name}</td>
                            <td style={{ padding: '10px', border: '1px solid #f0f0f0', textAlign: 'center' }}>
                                {employee.birth_date}
                            </td>
                            <td style={{ padding: '10px', border: '1px solid #f0f0f0', textAlign: 'center' }}>
                                {employee.hire_date}
                            </td>
                            <td style={{ padding: '10px', border: '1px solid #f0f0f0', textAlign: 'center' }}>
                                {employee.profile_picture ? (
                                    <img
                                    src={`/storage/${employee.profile_picture}`} // เพิ่ม /storage/ นำหน้า
                                        alt={`${employee.first_name} ${employee.last_name}`}
                                        style={{
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            display: 'block', // ทำให้ img เป็น block เพื่อจัดกึ่งกลาง
                                            margin: '0 auto', // จัดให้อยู่ตรงกลางแนวนอน
                                        }}
                                    />
                                ) : (
                                    <span style={{ color: '#888' }}>MaiMeeRuP</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-center mt-6">
                {employees.links &&
                    employees.links.map((link, index) => (
                        <button
                            key={index}
                            onClick={() => router.get(link.url)}
                            className={`px-3 py-2 mx-1 border rounded-md ${
                                link.active
                                    ? 'bg-gray-700 text-white' // ปุ่ม active สีเทาเข้ม
                                    : 'bg-white text-gray-700 border-gray-400 hover:bg-gray-100'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
            </div>
        </div>
    );
}
