import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../index.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [units, setUnits] = useState([]);
    const [customers, setCustomers] = useState([]);
    
    // Form state
    const [unitId, setUnitId] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const [bookRes, unitRes, custRes] = await Promise.all([
                fetch('/api/bookings', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/units', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/customers', { headers: { 'Authorization': `Bearer ${token}` } })
            ]);
            const bookData = await bookRes.json();
            const unitData = await unitRes.json();
            const custData = await custRes.json();
            
            if (Array.isArray(bookData)) setBookings(bookData); else setBookings([]);
            if (Array.isArray(unitData)) { setUnits(unitData); if (unitData.length > 0) setUnitId(unitData[0].id); } else setUnits([]);
            if (Array.isArray(custData)) { setCustomers(custData); if (custData.length > 0) setCustomerId(custData[0].id); } else setCustomers([]);
        } catch (err) { console.error('Error fetching data', err); }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const unit = units.find(u => u.id === unitId);
            if (!unit) return alert('Unit not found');
            
            const start = new Date(checkInDate);
            const end = new Date(checkOutDate);
            const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            if (days <= 0) return alert('Check-out must be after Check-in');
            
            const totalAmount = days * unit.dailyRate;
            
            const token = localStorage.getItem('token');
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ unitId, customerId, checkInDate: start.toISOString(), checkOutDate: end.toISOString(), totalAmount })
            });
            const newBooking = await res.json();
            
            // Create corresponding property invoice
            await fetch('/api/property-invoices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    bookingId: newBooking.id,
                    customerId,
                    dueDate: end.toISOString(),
                    subtotal: totalAmount,
                    vat: totalAmount * 0.15,
                    total: totalAmount * 1.15
                })
            });

            setCheckInDate('');
            setCheckOutDate('');
            fetchData();
        } catch (err) { console.error('Error creating booking', err); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this booking?')) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/bookings/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            fetchData();
        } catch (err) { console.error('Error deleting booking', err); }
    };

    const calendarEvents = bookings.map(b => {
        const unit = units.find(u => u.id === b.unitId);
        const cust = customers.find(c => c.id === b.customerId);
        return {
            id: b.id,
            title: `${unit ? unit.unitNumber : 'Unit'} - ${cust ? cust.name : 'Customer'}`,
            start: new Date(b.checkInDate),
            end: new Date(b.checkOutDate),
            allDay: true,
            resource: b
        };
    });

    return (
        <div className="view-container">
            <div className="header-row">
                <h2>Manage Bookings</h2>
            </div>
            
            <div className="card">
                <h3>New Booking</h3>
                <form onSubmit={handleCreate} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <select value={unitId} onChange={e => setUnitId(e.target.value)} required>
                        <option value="" disabled>Select Unit</option>
                        {units.map(u => <option key={u.id} value={u.id}>{u.unitNumber} ({u.type}) - {u.dailyRate}/night</option>)}
                    </select>
                    <select value={customerId} onChange={e => setCustomerId(e.target.value)} required>
                        <option value="" disabled>Select Customer</option>
                        {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <input type="date" value={checkInDate} onChange={e => setCheckInDate(e.target.value)} required title="Check-in" />
                    <input type="date" value={checkOutDate} onChange={e => setCheckOutDate(e.target.value)} required title="Check-out" />
                    <button type="submit" className="primary-btn">Book</button>
                </form>
            </div>

            <div className="card" style={{ marginTop: '20px', height: '500px' }}>
                <Calendar
                    localizer={localizer}
                    events={calendarEvents}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%' }}
                    views={['month', 'week', 'day']}
                    onSelectEvent={(event) => alert(`Booking Details:\nUnit: ${event.title}\nStatus: ${event.resource.status}\nTotal: ${event.resource.totalAmount}`)}
                />
            </div>
            
            <div className="card" style={{ marginTop: '20px' }}>
                <h3>Booking List</h3>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Unit</th>
                            <th>Customer</th>
                            <th>Check-in</th>
                            <th>Check-out</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map(b => {
                            const unit = units.find(u => u.id === b.unitId);
                            const cust = customers.find(c => c.id === b.customerId);
                            return (
                                <tr key={b.id}>
                                    <td>{unit ? unit.unitNumber : b.unitId}</td>
                                    <td>{cust ? cust.name : b.customerId}</td>
                                    <td>{new Date(b.checkInDate).toLocaleDateString()}</td>
                                    <td>{new Date(b.checkOutDate).toLocaleDateString()}</td>
                                    <td>{b.totalAmount}</td>
                                    <td><span className={`status-badge ${b.status.toLowerCase()}`}>{b.status}</span></td>
                                    <td>
                                        <button className="danger-btn" onClick={() => handleDelete(b.id)}>Delete</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Bookings;
