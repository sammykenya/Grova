import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  TrendingDown, 
  TrendingUp, 
  ShoppingCart, 
  Car, 
  Home, 
  Utensils, 
  GamepadIcon, 
  MoreHorizontal,
  Calendar,
  DollarSign,
  Receipt
} from "lucide-react";

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
  type: 'expense' | 'income';
}

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    amount: '',
    category: '',
    description: '',
    type: 'expense' as 'expense' | 'income'
  });
  const [animateCards, setAnimateCards] = useState(false);
  const { toast } = useToast();

  const categories = [
    { name: 'Housing', icon: Home, color: 'hsl(207,90%,54%)' },
    { name: 'Transportation', icon: Car, color: 'hsl(25,85%,53%)' },
    { name: 'Food', icon: Utensils, color: 'hsl(142,71%,45%)' },
    { name: 'Shopping', icon: ShoppingCart, color: 'hsl(262,83%,58%)' },
    { name: 'Entertainment', icon: GamepadIcon, color: 'hsl(217,91%,60%)' },
    { name: 'Other', icon: MoreHorizontal, color: 'hsl(197,71%,52%)' }
  ];

  useEffect(() => {
    setAnimateCards(true);
    // Load sample data
    const sampleExpenses: Expense[] = [
      {
        id: '1',
        amount: 2500,
        category: 'Housing',
        description: 'Monthly rent',
        date: new Date(),
        type: 'expense'
      },
      {
        id: '2',
        amount: 8500,
        category: 'Salary',
        description: 'Monthly salary',
        date: new Date(),
        type: 'income'
      },
      {
        id: '3',
        amount: 450,
        category: 'Food',
        description: 'Groceries',
        date: new Date(Date.now() - 86400000),
        type: 'expense'
      },
      {
        id: '4',
        amount: 200,
        category: 'Transportation',
        description: 'Uber rides',
        date: new Date(Date.now() - 172800000),
        type: 'expense'
      }
    ];
    setExpenses(sampleExpenses);
  }, []);

  const addExpense = () => {
    if (!newExpense.amount || !newExpense.category || !newExpense.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const expense: Expense = {
      id: Date.now().toString(),
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      description: newExpense.description,
      date: new Date(),
      type: newExpense.type
    };

    setExpenses(prev => [expense, ...prev]);
    setNewExpense({ amount: '', category: '', description: '', type: 'expense' });
    setIsAddModalOpen(false);

    toast({
      title: `${newExpense.type === 'expense' ? 'Expense' : 'Income'} Added`,
      description: `KES ${expense.amount} recorded successfully`
    });
  };

  const totalIncome = expenses.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);
  const totalExpenses = expenses.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
  const netAmount = totalIncome - totalExpenses;

  const getCategoryStats = () => {
    const stats = categories.map(category => {
      const categoryExpenses = expenses.filter(e => e.category === category.name && e.type === 'expense');
      const total = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
      const percentage = totalExpenses > 0 ? (total / totalExpenses) * 100 : 0;
      
      return {
        ...category,
        total,
        percentage,
        count: categoryExpenses.length
      };
    }).filter(stat => stat.total > 0);

    return stats.sort((a, b) => b.total - a.total);
  };

  const categoryStats = getCategoryStats();

  return (
    <div className="space-y-6">
      {/* Financial Overview */}
      <div className="grid grid-cols-3 gap-4">
        <div className="neo-card-interactive p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="neo-icon bg-gradient-to-br from-green-500 to-green-600">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs text-green-600">+12%</span>
          </div>
          <div className={`grova-data text-lg text-green-600 ${animateCards ? 'balance-counter' : ''}`}>
            KES {totalIncome.toLocaleString()}
          </div>
          <p className="grova-body text-gray-600 text-xs">Income</p>
        </div>

        <div className="neo-card-interactive p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="neo-icon bg-gradient-to-br from-red-500 to-red-600">
              <TrendingDown className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs text-red-600">-5%</span>
          </div>
          <div className={`grova-data text-lg text-red-600 ${animateCards ? 'balance-counter' : ''}`}>
            KES {totalExpenses.toLocaleString()}
          </div>
          <p className="grova-body text-gray-600 text-xs">Expenses</p>
        </div>

        <div className="neo-card-interactive p-4">
          <div className="flex items-center justify-between mb-3">
            <div className={`neo-icon bg-gradient-to-br ${netAmount >= 0 ? 'from-[hsl(207,90%,54%)] to-[hsl(207,70%,62%)]' : 'from-red-500 to-red-600'}`}>
              <DollarSign className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className={`grova-data text-lg ${netAmount >= 0 ? 'text-[hsl(207,90%,54%)]' : 'text-red-600'} ${animateCards ? 'balance-counter' : ''}`}>
            KES {netAmount.toLocaleString()}
          </div>
          <p className="grova-body text-gray-600 text-xs">Net</p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="neo-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="grova-section-title flex items-center">
            <Receipt className="w-5 h-5 mr-2 text-[hsl(207,90%,54%)]" />
            Expense Categories
          </h3>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="neo-button-primary neo-ripple"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>

        <div className="space-y-4">
          {categoryStats.map((category, index) => {
            const Icon = category.icon;
            return (
              <div 
                key={category.name}
                className="flex items-center justify-between p-4 neo-card-small hover:neo-card-interactive transition-all"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: category.color }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="grova-body font-semibold">{category.name}</p>
                    <p className="text-xs text-gray-500">{category.count} transactions</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="grova-body font-bold">KES {category.total.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{category.percentage.toFixed(1)}%</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="neo-card p-6">
        <h3 className="grova-section-title mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-[hsl(25,85%,53%)]" />
          Recent Transactions
        </h3>
        
        <div className="space-y-3">
          {expenses.slice(0, 5).map((expense, index) => (
            <div 
              key={expense.id}
              className="flex items-center justify-between p-3 neo-card-small hover:neo-card-interactive transition-all"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  expense.type === 'income' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                }`}>
                  {expense.type === 'income' ? (
                    <TrendingUp className="w-5 h-5" />
                  ) : (
                    <TrendingDown className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <p className="grova-body font-medium">{expense.description}</p>
                  <p className="text-xs text-gray-500">{expense.category}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`grova-body font-bold ${
                  expense.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {expense.type === 'income' ? '+' : '-'}KES {expense.amount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">
                  {expense.date.toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Expense Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="neo-modal">
          <DialogHeader>
            <DialogTitle className="grova-headline flex items-center">
              <Plus className="w-5 h-5 mr-2 text-[hsl(207,90%,54%)]" />
              Add Transaction
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 p-4">
            <div>
              <Label className="grova-body font-medium">Type</Label>
              <Select value={newExpense.type} onValueChange={(value: 'expense' | 'income') => 
                setNewExpense(prev => ({ ...prev, type: value }))
              }>
                <SelectTrigger className="neo-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="grova-body font-medium">Amount (KES)</Label>
              <Input
                type="number"
                placeholder="0"
                value={newExpense.amount}
                onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                className="neo-input"
              />
            </div>

            <div>
              <Label className="grova-body font-medium">Category</Label>
              <Select value={newExpense.category} onValueChange={(value) => 
                setNewExpense(prev => ({ ...prev, category: value }))
              }>
                <SelectTrigger className="neo-input">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.name} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                  {newExpense.type === 'income' && (
                    <>
                      <SelectItem value="Salary">Salary</SelectItem>
                      <SelectItem value="Freelance">Freelance</SelectItem>
                      <SelectItem value="Investment">Investment</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="grova-body font-medium">Description</Label>
              <Input
                placeholder="What was this for?"
                value={newExpense.description}
                onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                className="neo-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <Button
                onClick={() => setIsAddModalOpen(false)}
                variant="outline"
                className="neo-button"
              >
                Cancel
              </Button>
              <Button
                onClick={addExpense}
                className="neo-button-primary neo-ripple"
              >
                Add Transaction
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}