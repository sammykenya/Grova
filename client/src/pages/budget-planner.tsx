import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  PieChart,
  ArrowLeft,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { Link } from "wouter";
import BottomNavigation from "@/components/bottom-navigation";

interface BudgetCategory {
  id: string;
  name: string;
  budgeted: number;
  spent: number;
  color: string;
}

export default function BudgetPlanner() {
  const [monthlyIncome, setMonthlyIncome] = useState("75000");
  const [categories, setCategories] = useState<BudgetCategory[]>([
    { id: "1", name: "Housing", budgeted: 25000, spent: 22000, color: "bg-blue-500" },
    { id: "2", name: "Food & Groceries", budgeted: 15000, spent: 18500, color: "bg-green-500" },
    { id: "3", name: "Transportation", budgeted: 8000, spent: 6500, color: "bg-yellow-500" },
    { id: "4", name: "Utilities", budgeted: 5000, spent: 4200, color: "bg-purple-500" },
    { id: "5", name: "Entertainment", budgeted: 6000, spent: 7200, color: "bg-pink-500" },
    { id: "6", name: "Healthcare", budgeted: 4000, spent: 2800, color: "bg-red-500" },
    { id: "7", name: "Savings", budgeted: 12000, spent: 12000, color: "bg-indigo-500" }
  ]);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryBudget, setNewCategoryBudget] = useState("");

  const totalBudgeted = categories.reduce((sum, cat) => sum + cat.budgeted, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const remainingBudget = parseFloat(monthlyIncome) - totalBudgeted;
  const actualRemaining = parseFloat(monthlyIncome) - totalSpent;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPercentage = (spent: number, budgeted: number) => {
    return budgeted > 0 ? (spent / budgeted) * 100 : 0;
  };

  const getCategoryStatus = (spent: number, budgeted: number) => {
    const percentage = getPercentage(spent, budgeted);
    if (percentage > 100) return "over";
    if (percentage > 80) return "warning";
    return "good";
  };

  const addCategory = () => {
    if (newCategoryName && newCategoryBudget) {
      const newCategory: BudgetCategory = {
        id: Date.now().toString(),
        name: newCategoryName,
        budgeted: parseFloat(newCategoryBudget),
        spent: 0,
        color: `bg-${['orange', 'teal', 'cyan', 'lime', 'amber'][Math.floor(Math.random() * 5)]}-500`
      };
      setCategories([...categories, newCategory]);
      setNewCategoryName("");
      setNewCategoryBudget("");
    }
  };

  const updateCategorySpent = (id: string, spent: number) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, spent } : cat
    ));
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-900">
      <div className="max-w-6xl mx-auto px-4 py-6 pb-20">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/more">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Budget Planner
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Plan and track your monthly budget to achieve your financial goals
            </p>
          </div>
          <Target className="w-8 h-8 text-green-600" />
        </div>

        {/* Income and Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Monthly Income</p>
                  <p className="text-2xl font-bold">{formatCurrency(parseFloat(monthlyIncome))}</p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Total Budgeted</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalBudgeted)}</p>
                </div>
                <Target className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Total Spent</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className={`bg-gradient-to-r ${actualRemaining >= 0 ? 'from-orange-500 to-orange-600' : 'from-red-500 to-red-600'} text-white border-0`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Remaining</p>
                  <p className="text-2xl font-bold">{formatCurrency(actualRemaining)}</p>
                </div>
                {actualRemaining >= 0 ? 
                  <TrendingUp className="w-8 h-8 text-orange-200" /> : 
                  <TrendingDown className="w-8 h-8 text-red-200" />
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Income Setting */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Monthly Income</CardTitle>
            <CardDescription>Set your monthly income to create an accurate budget</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="income">Monthly Income (KES)</Label>
                <Input
                  id="income"
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  placeholder="75000"
                />
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Available for budgeting</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(remainingBudget)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget Categories */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Budget Categories
            </CardTitle>
            <CardDescription>Track spending across different categories</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {categories.map((category) => {
              const percentage = getPercentage(category.spent, category.budgeted);
              const status = getCategoryStatus(category.spent, category.budgeted);
              
              return (
                <div key={category.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${category.color}`}></div>
                      <h4 className="font-medium">{category.name}</h4>
                      {status === "over" && <Badge variant="destructive" className="text-xs">Over Budget</Badge>}
                      {status === "warning" && <Badge variant="outline" className="text-xs text-yellow-600">Warning</Badge>}
                      {status === "good" && <Badge variant="outline" className="text-xs text-green-600">On Track</Badge>}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteCategory(category.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm">Budgeted</Label>
                      <p className="font-semibold">{formatCurrency(category.budgeted)}</p>
                    </div>
                    <div>
                      <Label className="text-sm">Spent</Label>
                      <Input
                        type="number"
                        value={category.spent}
                        onChange={(e) => updateCategorySpent(category.id, parseFloat(e.target.value) || 0)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Remaining</Label>
                      <p className={`font-semibold ${category.budgeted - category.spent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(category.budgeted - category.spent)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{percentage.toFixed(1)}%</span>
                    </div>
                    <Progress 
                      value={Math.min(percentage, 100)} 
                      className={`h-2 ${status === "over" ? "bg-red-100" : status === "warning" ? "bg-yellow-100" : "bg-green-100"}`}
                    />
                  </div>
                </div>
              );
            })}
            
            {/* Add New Category */}
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="newCategoryName">Category Name</Label>
                  <Input
                    id="newCategoryName"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g., Personal Care"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="newCategoryBudget">Budget Amount (KES)</Label>
                  <Input
                    id="newCategoryBudget"
                    type="number"
                    value={newCategoryBudget}
                    onChange={(e) => setNewCategoryBudget(e.target.value)}
                    placeholder="3000"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={addCategory} className="w-full md:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Budget Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Budget Utilization</span>
                  <span className="font-medium">{((totalSpent / totalBudgeted) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Categories Over Budget</span>
                  <span className="font-medium text-red-600">
                    {categories.filter(cat => cat.spent > cat.budgeted).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Savings Rate</span>
                  <span className="font-medium text-green-600">
                    {((actualRemaining / parseFloat(monthlyIncome)) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                Budget Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>• Follow the 50/30/20 rule: 50% needs, 30% wants, 20% savings</p>
                <p>• Review and adjust your budget monthly</p>
                <p>• Build an emergency fund of 3-6 months expenses</p>
                <p>• Track every expense to stay accountable</p>
                <p>• Use budgeting apps to monitor spending in real-time</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomNavigation currentPage="more" />
    </div>
  );
}