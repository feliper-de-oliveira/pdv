import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Database, Clock, DollarSign, Search, LogOut } from 'lucide-react';

import { AspectRatio } from '@/components/ui/aspect-ratio';

// Sample products

interface Product {
    category_name: any;
    id: number;
    name: string;
    price: number;
    image: string;
    current_stock: number;
}



export default function Inventory() {
    const { toast } = useToast();

    const [ newProductTeste] =  useState<Product[]>(usePage().props.products);

    const [searchTerm, setSearchTerm] = useState('');

    const [newProduct, setNewProduct] = useState<Partial<Product>>({
        name: '',
        price: 0,
        category: '',
        stock: 0,
        image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9'
    });


    const filteredProductTeste = newProductTeste.filter(teste =>
        teste.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teste.category_name.toLowerCase().includes(searchTerm.toLocaleLowerCase())
    );


    //Add new product
    const addNewProduct = () => {
        if (!newProduct.name || !newProduct.price || !newProduct.category) {
            toast({
                title: 'Missing information',
                description: 'Please fill in all required fields',
                variant: 'destructive'
            });
            return;
        }

        router.post('products/create', {
            name: newProduct.name,
            category_name: newProduct.category,
            price: newProduct.price,
            current_stock: newProduct.stock,
            is_active: true
        }, {
            onSuccess: () => {
                toast({
                    title: 'Produto criado',
                    description: `${newProduct.name} foi adicionado ao estoque`
                });
                setNewProduct({
                    name: '',
                    price: 0,
                    category: '',
                    stock: 0,
                    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9'
                });
            }
        });
    };

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

            <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
                {/* Product list - 4/6 of screen */}
                <Card className="lg:col-span-4">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-2xl">Todos os produtos</CardTitle>
                        <div className="relative w-full">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Procure pelo nome ou categoria"
                                className="pl-8 text-lg h-12"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-lg">Produto</TableHead>
                                        <TableHead className="text-lg text-center">Categoria</TableHead>
                                        <TableHead className="text-lg text-center">Preço</TableHead>
                                        <TableHead className="text-lg text-center">Estoque</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredProductTeste.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center h-32">
                                                <p className="text-lg text-muted-foreground">No products found</p>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredProductTeste.map((product) => (

                                            <TableRow key={product.id}>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-12 h-12 rounded-md overflow-hidden">
                                                            <AspectRatio ratio={1 / 1}>
                                                                <img
                                                                    src={'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9'}
                                                                    alt={product.name}
                                                                    className="object-cover w-full h-full"
                                                                />
                                                            </AspectRatio>
                                                        </div>
                                                        <span className="text-lg">{product.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant="outline">{product.category_name}</Badge>
                                                </TableCell>
                                                <TableCell
                                                    className="text-center text-lg">${product.price}</TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant={product.current_stock > 5 ? "outline" : "destructive"} className="text-md">
                                                      {product.current_stock}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Add new product - 2/6 of screen */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-2xl">Novo Produto</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="new-name" className="text-lg">Nome</Label>
                                <Input
                                    id="new-name"
                                    placeholder="Nome do produto"
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                    className="h-12 text-lg"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-price" className="text-lg">Preço</Label>
                                <Input
                                    id="new-price"
                                    type="number"
                                    step="0.01"
                                    placeholder="Price"
                                    value={newProduct.price}
                                    onChange={(e) => setNewProduct({
                                        ...newProduct,
                                        price: parseFloat(e.target.value)
                                    })}
                                    className="h-12 text-lg"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-category" className="text-lg">Categoria</Label>
                                <Input
                                    id="new-category"
                                    placeholder="Categoria"
                                    value={newProduct.category}
                                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                    className="h-12 text-lg"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-stock" className="text-lg">Estoque</Label>
                                <Input
                                    id="new-stock"
                                    type="number"
                                    placeholder="Stock quantity"
                                    value={newProduct.stock}
                                    onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
                                    className="h-12 text-lg"
                                />
                            </div>
                            <Button
                                className="w-full h-14 text-lg font-bold mt-4"
                                onClick={addNewProduct}
                            >
                                Adcionar Produto
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};


