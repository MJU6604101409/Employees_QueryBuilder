<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = $request->input('search');
        $sortBy = $request->input('sortBy', 'emp_no');
        $sortDirection = $request->input('sortDirection', 'asc');

        $employees = DB::table("employees") // ดึงข้อมูลจากตาราง
                ->where(function($q) use ($query) {
                    if ($query) {
                        $q->where('first_name', 'like', '%' . $query . '%')
                          ->orWhere('last_name', 'like', '%' . $query . '%');

                    }
                })
                ->orderBy($sortBy, $sortDirection)
                ->paginate(10)
                ->appends(['search' => $query, 'sortBy' => $sortBy, 'sortDirection' => $sortDirection]); // แนบ parameter ไว้ใน pagination


        return Inertia::render('Employee/Index', [
            'employees' => $employees,
            'query' => $query,
            'sortBy' => $sortBy,
            'sortDirection' => $sortDirection,
        ]);
    }

    public function create()
    {
        // ดึงรายชื่อแผนกจากฐานข้อมูล เพื่อแสดงในแบบฟอร์ม
        $departments = DB::table('departments')
            ->select('dept_no', 'dept_name')
            ->get();


        return inertia('Employee/Create', [ // ส่งข้อมูลแผนกไปที่หน้าคลีเอท
            'departments' => $departments
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // 1. ตรวจสอบข้อมูลที่ส่งมาจากฟอร์ม
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'birth_date' => 'required|date',
            'hire_date' => 'required|date',
            'dept_no' => 'required|string|exists:departments,dept_no',
            'gender' => 'nullable|string|in:Male,Female',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // ตรวจสอบให้แน่ใจว่าไม่มี syntax error
        ]);



        // บันทึกข้อมูลแต่ละช่องใน Laravel Log
        Log::info("Employee Data");
        Log::info('"First Name": "' . $validated['first_name'] . '"');
        Log::info('"Last Name": "' . $validated['last_name'] . '"');
        Log::info('"Birth Date": "' . $validated['birth_date'] . '"');
        Log::info('"Hire Date": "' . $validated['hire_date'] . '"');
        Log::info('"Department No": "' . $validated['dept_no'] . '"');

        $profilePicturePath = null;
        if ($request->hasFile('profile_picture')) {
            $profilePicturePath = $request->file('profile_picture')->store('profile_pictures', 'public');
        }

        DB::transaction(function () use ($validated , $profilePicturePath) {
            // หา emp_no ล่าสุด
            $latestEmpNo = DB::table('employees')->max('emp_no') ?? 0;
            $newEmpNo = $latestEmpNo + 1;

            // เพิ่มข้อมูลลงในตาราง employees
            DB::table('employees')->insert([
                'emp_no' => $newEmpNo,
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'birth_date' => $validated['birth_date'],
                'hire_date' => $validated['hire_date'],
                'gender' => $validated['gender'] === 'Male' ? 'M' : 'F', // แปลงค่า gender เป็น M หรือ F
                'profile_picture' => $profilePicturePath, // เก็บ path ของรูปภาพ
            ]);

            // เพิ่มข้อมูลลงในตาราง dept_emp
            DB::table('dept_emp')->insert([
                'emp_no' => $newEmpNo,
                'dept_no' => $validated['dept_no'],
                'from_date' => now(),
                'to_date' => now()->addYears(5)->format('Y-m-d'),
            ]);
        });

        try {
            // ส่งกลับไปหน้ารายการพนักงานพร้อมข้อความแจ้งเตือน
            return redirect()->route('employees.index')
                ->with('success', 'Employee created successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to create employee. Please try again.');


        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
