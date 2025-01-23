<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\EmployeeController;

Route::get('/employees', [EmployeeController::class, 'index']); // แสดงข้อมูลพนักงาน
// Route::resource('employee', EmployeeController::class) ->only(['index'])


Route::get('/employee/create', action: [EmployeeController::class, 'create'])->name('employee.create');
Route::post('/employee', action: [EmployeeController::class, 'store'])->name('employee.store');
Route::get('/employee', action: [EmployeeController::class, 'index'])->name('employee.index');
Route::resource('employees', controller: EmployeeController::class);


Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});


Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});



require __DIR__.'/auth.php';