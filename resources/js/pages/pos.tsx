
import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ArrowRightIcon, Database, Clock, DollarSign, Search, LogOut } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';

interface Product {
    category_name: any;
    id: number;
    name: string;
    price: number;
    image: string;
    current_stock: number;
}

interface CartItem extends Product {
    quantity: number;
}

export default function Pos() {
    const { toast } = useToast();

    const [cart, setCart] = useState<CartItem[]>([]);
    const [cashReceived, setCashReceived] = useState<string>('');
    const [ newProductTeste] =  useState<Product[]>(usePage().props.products);
    //
    const [searchTerm, setSearchTerm] = useState('');
    //
    const [newProduct, setNewProduct] = useState<Partial<Product>>({
        name: '',
        price: 0,
        category: '',
        stock: 0,
        image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9'
    });



    const filteredProductTeste = newProductTeste
        .filter(teste => teste.current_stock > 0)
        .filter(teste =>
        teste.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teste.category_name.toLowerCase().includes(searchTerm.toLocaleLowerCase())
    );

    // Add product to cart
    const addToCart = (product: Product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                // Don't add more than what's in stock
                if (existingItem.quantity >= product.current_stock) {
                    toast({
                        title: "Cannot add more",
                        description: "No more items in stock",
                        variant: "destructive",
                    });
                    return prevCart;
                }

                return prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                toast({
                    title: "Added to cart",
                    description: `${product.name} added to cart`,
                });
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });
    };

    // Remove product from cart
    const removeFromCart = (productId: number) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === productId);
            if (existingItem && existingItem.quantity > 1) {
                return prevCart.map(item =>
                    item.id === productId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                );
            } else {
                return prevCart.filter(item => item.id !== productId);
            }
        });
    };

    // Calculate total
    const cartTotal = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    // Calculate change
    const calculateChange = () => {
        const cashReceivedNum = parseFloat(cashReceived);
        if (isNaN(cashReceivedNum)) return 0;
        return cashReceivedNum - cartTotal;
    };

    // Complete sale
    const completeSale = () => {
        if (parseFloat(cashReceived) < cartTotal) {
            toast({
                title: "Insufficient payment",
                description: "The cash received is less than the total amount",
                variant: "destructive",
            });
            return;
        }

        router.post('/sales', {
            items: cart.map(item => ({
                product_id: item.id,
                quantity: item.quantity,
                price: item.price,
            })),
            total: cartTotal,
            cash_received: parseFloat(cashReceived),
            change: calculateChange(),
        }, {
            onSuccess: () => {
                toast({
                    title: "Venda registrada",
                    description: `Total: R$${cartTotal.toFixed(2)} | Troco: R$${calculateChange().toFixed(2)}`,
                });
                setCart([]);
                setCashReceived('');
                router.reload();
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Products section - 2/3 of screen on desktop */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-2xl">Produtos</CardTitle>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="relative w-full">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="Search products..."
                                        className="pl-8 text-lg h-12"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent>
                            {/* Product Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {filteredProductTeste.map((product) => (
                                    <Card
                                        key={product.id}
                                        className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
                                        onClick={() => addToCart(product)}
                                    >
                                        <div className="w-full">
                                            <AspectRatio ratio={1/1}>
                                                <img
                                                    src={'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9'}
                                                    alt={product.name}
                                                    className="object-cover w-full h-full rounded-t-md"
                                                />
                                            </AspectRatio>
                                        </div>
                                        <CardContent className="p-3">
                                            <h3 className="font-bold text-lg truncate">{product.name}</h3>
                                            <div className="flex justify-between items-center">
                                                <p className="text-lg font-bold">${product.price}</p>
                                                <Badge variant={product.current_stock > 5 ? "outline" : "destructive"}>
                                                    {product.current_stock}
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                </div>

                {/* Cart section - 1/3 of screen on desktop */}
                <div className="lg:col-span-1">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="text-2xl">Carrinho</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {cart.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <p className="text-lg">O carrinho esta vazio</p>
                                    <p>Clique no produto para adicionar no carrinho</p>
                                </div>
                            ) : (
                                <>
                                    {/* Cart Items */}
                                    <div className="max-h-[calc(100vh-450px)] overflow-y-auto space-y-3">
                                        {cart.map((item) => (
                                            <div key={item.id} className="flex justify-between items-center p-3 border rounded-lg">
                                                <div>
                                                    <p className="font-bold text-lg">{item.name}</p>
                                                    <p>${item.price} x {item.quantity}</p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <p className="font-bold text-lg">${(item.price * item.quantity)}</p>
                                                    <Button variant="outline" size="sm" onClick={() => removeFromCart(item.id)}>-</Button>
                                                    <Button variant="outline" size="sm" onClick={() => addToCart(item)}>+</Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Total */}
                                    <div className="border-t pt-4">
                                        <div className="flex justify-between text-xl font-bold">
                                            <p>Total:</p>
                                            <p>${cartTotal.toFixed(2)}</p>
                                        </div>
                                    </div>

                                    {/* Payment Dialog */}
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button className="w-full h-14 text-lg font-bold mt-4">
                                                Pagamento <ArrowRightIcon className="ml-2" />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-md">
                                            <DialogHeader>
                                                <DialogTitle className="text-xl">Completo o pagamento</DialogTitle>
                                            </DialogHeader>

                                            <div className="space-y-4 py-4">
                                                <div className="flex justify-between text-lg font-semibold">
                                                    <p>Total:</p>
                                                    <p>${cartTotal.toFixed(2)}</p>
                                                </div>

                                                <div className="space-y-2">
                                                    <p className="text-lg">Recebido:</p>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={cashReceived}
                                                        onChange={(e) => setCashReceived(e.target.value)}
                                                        className="text-xl h-12"
                                                    />
                                                </div>

                                                {parseFloat(cashReceived) >= cartTotal && (
                                                    <div className="flex justify-between text-lg font-semibold text-green-600">
                                                        <p>Troco:</p>
                                                        <p>${calculateChange().toFixed(2)}</p>
                                                    </div>
                                                )}

                                                <Button
                                                    className="w-full h-14 text-lg font-bold"
                                                    onClick={completeSale}
                                                    disabled={parseFloat(cashReceived) < cartTotal}
                                                >
                                                    Pagar
                                                </Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};


