
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Database, Clock, DollarSign, Search, Calendar, LogOut } from 'lucide-react';

import { format } from 'date-fns';
import { router, usePage } from '@inertiajs/react';

// // Sample sales data
// const SAMPLE_SALES = [
//     { id: 1, date: new Date(2023, 5, 15, 9, 30), items: 4, total: 28.96, paymentMethod: "Cash", cashier: "Owner" },
//     { id: 2, date: new Date(2023, 5, 15, 14, 15), items: 2, total: 15.98, paymentMethod: "Cash", cashier: "Owner" },
//     { id: 3, date: new Date(2023, 5, 14, 11, 45), items: 3, total: 22.47, paymentMethod: "Cash", cashier: "Owner" },
//     { id: 4, date: new Date(2023, 5, 14, 16, 20), items: 1, total: 4.99, paymentMethod: "Cash", cashier: "Owner" },
//     { id: 5, date: new Date(2023, 5, 13, 10, 10), items: 6, total: 35.94, paymentMethod: "Cash", cashier: "Owner" },
// ];

// Sample sales details
const SAMPLE_SALE_DETAILS = [
    { saleId: 1, productName: "Apples", quantity: 2, price: 2.99, subtotal: 5.98 },
    { saleId: 1, productName: "Milk", quantity: 1, price: 3.49, subtotal: 3.49 },
    { saleId: 1, productName: "Bread", quantity: 1, price: 2.49, subtotal: 2.49 },
    { saleId: 1, productName: "Orange Juice", quantity: 2, price: 4.99, subtotal: 9.98 },
    { saleId: 2, productName: "Bananas", quantity: 3, price: 1.99, subtotal: 5.97 },
    { saleId: 2, productName: "Milk", quantity: 1, price: 3.49, subtotal: 3.49 },
];

interface Sale {
    id: number;
    date: Date;
    items: number;
    total: number;
    paymentMethod: string;
    cashier: string;
}

interface SaleDetail {
    saleId: number;
    productName: string;
    quantity: number;
    price: number;
    subtotal: number;
}

export default function SalesHistory() {

    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedSale, setSelectedSale] = useState<number | null>(null);

    const { sales = [] } = usePage().props as { sales: any[] };
    const { saleDetail = [] } = usePage().props as { saleDetail: any[] };


    // Filter sales based on search term and date range
    const filteredSales = sales.filter(sale => {
        const matchesDate = (!startDate || new Date(sale.date) >= new Date(startDate)) &&
            (!endDate || new Date(sale.date) <= new Date(endDate));

        // Convert date to string for search
        const saleDate = format(sale.date, 'MMM dd, yyyy');
        const matchesSearch = saleDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sale.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sale.cashier.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch && matchesDate;
    });

    // Get details for selected sale
    const saleDetails = selectedSale
        ? saleDetail.filter(detail => detail.saleId === selectedSale)
        : [];



    // Calculate daily totals
    const calculateDailyStats = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todaySales = sales.filter(sale => {
            const saleDate = new Date(sale.date);
            saleDate.setHours(0, 0, 0, 0);
            return saleDate.getTime() === today.getTime();
        });

        const totalSales = todaySales.length;
        const totalAmount = todaySales.reduce((sum, sale) => sum + sale.total, 0);
        const totalItems = todaySales.reduce((sum, sale) => sum + sale.items, 0);

        return { totalSales, totalAmount, totalItems };
    };

    const dailyStats = calculateDailyStats();

    return (
        <div className="container p-4 mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold mb-6 text-center">Controle de vendas</h1>
                <Button variant="outline" onClick={() => router.post(route('logout'))} className="flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                <Button
                    className="h-16 text-lg font-bold"
                    variant="outline"
                    onClick={() => router.visit('/pos')}
                >
                    <DollarSign className="mr-2" />
                    Venda
                </Button>

                <Button
                    className="h-16 text-lg font-bold"
                    variant="outline"
                    onClick={() => router.visit('/inventory')}
                >
                    <Database className="mr-2" />
                    Estoque
                </Button>
                <Button
                    className="h-16 text-lg font-bold"
                    variant="outline"
                    onClick={() => router.visit('/sales-history')}
                >
                    <Clock className="mr-2" />
                    Histórico de Vendas
                </Button>

            </div>

            {/* Daily Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xl">Vendas de hoje</CardTitle>
                        <CardDescription>Número de vendas</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{dailyStats.totalSales}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xl">Total do lucro</CardTitle>
                        <CardDescription>Total</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">${dailyStats.totalAmount.toFixed(2)}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xl">Itens vendido no dia</CardTitle>
                        <CardDescription>Quantidade total</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{dailyStats.totalItems}</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales List */}
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle className="text-2xl">Todas as vendas</CardTitle>
                        <div className="flex flex-col md:flex-row gap-4 mt-2">
                            <div className="relative w-full md:w-1/3">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Procure as vendas"
                                    className="pl-8 text-lg h-12"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="w-full md:w-1/3 flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="date"
                                    placeholder="Data de início"
                                    className="text-lg h-12"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <div className="w-full md:w-1/3 flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="date"
                                    placeholder="Data de término"
                                    className="text-lg h-12"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-lg">ID</TableHead>
                                        <TableHead className="text-lg">Date & Time</TableHead>
                                        <TableHead className="text-lg text-center">Items</TableHead>
                                        <TableHead className="text-lg text-center">Total</TableHead>
                                        <TableHead className="text-lg text-center">Payment</TableHead>
                                        <TableHead className="text-lg text-center">Cashier</TableHead>
                                        <TableHead className="text-lg text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredSales.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center h-32">
                                                <p className="text-lg text-muted-foreground">No sales found</p>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredSales.map((sale) => (
                                            <TableRow key={sale.id} className={selectedSale === sale.id ? "bg-muted/50" : ""}>
                                                <TableCell className="font-medium text-lg">{sale.id}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{format(sale.date, 'MMM dd, yyyy')}</span>
                                                        <span className="text-sm text-muted-foreground">{format(sale.date, 'h:mm a')}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center text-lg">{sale.items}</TableCell>
                                                <TableCell className="text-center text-lg font-bold">${sale.total.toFixed(2)}</TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant="outline">{sale.paymentMethod}</Badge>
                                                </TableCell>
                                                <TableCell className="text-center text-lg">{sale.cashier}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant={selectedSale === sale.id ? "secondary" : "outline"}
                                                        onClick={() => setSelectedSale(selectedSale === sale.id ? null : sale.id)}
                                                    >
                                                        {selectedSale === sale.id ? "Hide Details" : "View Details"}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Sale Details */}
                        {selectedSale && (
                            <div className="mt-6 border-t pt-6">
                                <h3 className="text-xl font-semibold mb-4">Venda #{selectedSale} detalhes</h3>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-lg">Produto</TableHead>
                                            <TableHead className="text-lg text-center">Preço</TableHead>
                                            <TableHead className="text-lg text-center">Quantidade</TableHead>
                                            <TableHead className="text-lg text-right">Subtotal</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {saleDetails.map((detail, index) => (
                                            <TableRow key={`${detail.saleId}-${index}`}>
                                                <TableCell className="font-medium text-lg">{detail.productName}</TableCell>
                                                <TableCell className="text-center">${detail.price.toFixed(2)}</TableCell>
                                                <TableCell className="text-center">{detail.quantity}</TableCell>
                                                <TableCell className="text-right font-bold">${detail.subtotal.toFixed(2)}</TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-right font-bold text-lg">Total</TableCell>
                                            <TableCell className="text-right font-bold text-lg">
                                                ${saleDetails.reduce((sum, detail) => sum + detail.subtotal, 0).toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};


