'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from 'antd';
import { BarChart3, CheckCircle, Folder, BookOpen, LogOut, ChevronDown, AlertCircle } from 'lucide-react';
import { DashboardTab } from '@/components/admin/tabs/dashboard-tab';
import { GroupNamesTab } from '@/components/admin/tabs/group-names-tab';
import { CategoriesTab } from '@/components/admin/tabs/categories-tab';
import { CollectionsTab } from '@/components/admin/tabs/collections-tab';

type Tab = 'dashboard' | 'group-names' | 'categories' | 'collections';

export default function AdminPage() {
	const router = useRouter();
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [activeTab, setActiveTab] = useState<Tab>(() => {
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem('adminActiveTab');
			return (saved as Tab) || 'dashboard';
		}
		return 'dashboard';
	});
	const [menuOpen, setMenuOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setMenuOpen(false);
			}
		};

		if (menuOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [menuOpen]);

	useEffect(() => {
		checkAuth();
	}, []);

	const checkAuth = async () => {
		try {
			const res = await fetch('/api/admin/check-auth', {
				credentials: 'include',
			});
			setIsAuthenticated(res.ok);
		} catch (error) {
			setIsAuthenticated(false);
		} finally {
			setIsLoading(false);
		}
	};

	const handleLogout = async () => {
		await fetch('/api/admin/logout', { method: 'POST' });
		setIsAuthenticated(false);
		router.push('/');
	};

	const handleTabChange = (tab: Tab) => {
		setActiveTab(tab);
		if (typeof window !== 'undefined') {
			localStorage.setItem('adminActiveTab', tab);
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-gray-600">加载中...</div>
			</div>
		);
	}

	if (!isAuthenticated) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
				<LoginForm onSuccess={() => setIsAuthenticated(true)} />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 flex">
			<aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-shrink-0 flex-col">
				<nav className="flex-1 p-4 space-y-1 overflow-auto">
					<button
						onClick={() => handleTabChange('dashboard')}
						className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
							activeTab === 'dashboard'
								? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200'
								: 'text-gray-700 hover:bg-gray-100'
						}`}
					>
						<BarChart3 className="h-5 w-5" />
						数据统计
					</button>
					<button
						onClick={() => handleTabChange('group-names')}
						className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
							activeTab === 'group-names'
								? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200'
								: 'text-gray-700 hover:bg-gray-100'
						}`}
					>
						<CheckCircle className="h-5 w-5" />
						群名管理
					</button>
					<button
						onClick={() => handleTabChange('categories')}
						className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
							activeTab === 'categories'
								? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200'
								: 'text-gray-700 hover:bg-gray-100'
						}`}
					>
						<Folder className="h-5 w-5" />
						分类管理
					</button>
					<button
						onClick={() => handleTabChange('collections')}
						className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
							activeTab === 'collections'
								? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200'
								: 'text-gray-700 hover:bg-gray-100'
						}`}
					>
						<BookOpen className="h-5 w-5" />
						合集管理
					</button>
				</nav>
				<div className="p-4 border-t border-border bg-card">
					<button
						onClick={handleLogout}
						className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
					>
						<LogOut className="h-4 w-4" />
						退出登录
					</button>
				</div>
			</aside>

			<main className="flex-1 overflow-auto w-full">
				<div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3">
					<div className="flex items-center justify-between">
						<h2 className="text-lg font-semibold text-gray-900">
							{activeTab === 'dashboard' && '数据统计'}
							{activeTab === 'group-names' && '群名管理'}
							{activeTab === 'categories' && '分类管理'}
							{activeTab === 'collections' && '合集管理'}
						</h2>
						<div className="relative" ref={menuRef}>
							<button
								onClick={() => setMenuOpen(!menuOpen)}
								className="p-2 -mr-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg flex items-center gap-1"
							>
								菜单
								<ChevronDown className={`h-4 w-4 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
							</button>
							{menuOpen && (
								<div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
									<button
										onClick={() => { handleTabChange('dashboard'); setMenuOpen(false); }}
										className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
											activeTab === 'dashboard'
												? 'bg-indigo-50 text-indigo-700'
												: 'text-gray-700 hover:bg-gray-100'
										}`}
									>
										<BarChart3 className="h-4 w-4" />
										数据统计
									</button>
									<button
										onClick={() => { handleTabChange('group-names'); setMenuOpen(false); }}
										className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
											activeTab === 'group-names'
												? 'bg-indigo-50 text-indigo-700'
												: 'text-gray-700 hover:bg-gray-100'
										}`}
									>
										<CheckCircle className="h-4 w-4" />
										群名管理
									</button>
									<button
										onClick={() => { handleTabChange('categories'); setMenuOpen(false); }}
										className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
											activeTab === 'categories'
												? 'bg-indigo-50 text-indigo-700'
												: 'text-gray-700 hover:bg-gray-100'
										}`}
									>
										<Folder className="h-4 w-4" />
										分类管理
									</button>
									<button
										onClick={() => { handleTabChange('collections'); setMenuOpen(false); }}
										className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
											activeTab === 'collections'
												? 'bg-indigo-50 text-indigo-700'
												: 'text-gray-700 hover:bg-gray-100'
										}`}
									>
										<BookOpen className="h-4 w-4" />
										合集管理
									</button>
									<div className="border-t border-border my-1"></div>
									<button
										onClick={() => { handleLogout(); setMenuOpen(false); }}
										className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
									>
										<LogOut className="h-4 w-4" />
										退出登录
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					{activeTab === 'dashboard' && <DashboardTab />}
					{activeTab === 'group-names' && <GroupNamesTab />}
					{activeTab === 'categories' && <CategoriesTab />}
					{activeTab === 'collections' && <CollectionsTab />}
				</div>
			</main>
		</div>
	);
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
	const [token, setToken] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setLoading(true);

		try {
			const res = await fetch('/api/admin/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ token }),
			});

			if (!res.ok) {
				const data = await res.json() as { error?: string };
				throw new Error(data.error || '登录失败');
			}

			onSuccess();
		} catch (err) {
			setError(err instanceof Error ? err.message : '登录失败，请重试');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 sm:p-8 w-full max-w-md mx-4 sm:mx-0">
			<h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
				后台登录
			</h1>

			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label htmlFor="token" className="block text-sm font-medium text-foreground mb-1">
						访问令牌
					</label>
					<Input.Password
						id="token"
						value={token}
						onChange={(e) => setToken(e.target.value)}
						placeholder="请输入访问令牌"
						required
					/>
				</div>

				{error && (
					<div className="flex items-center gap-2 bg-destructive/10 border border-destructive/20 rounded-md p-3 text-sm text-destructive">
						<AlertCircle className="h-4 w-4 flex-shrink-0" />
						<span>{error}</span>
					</div>
				)}

				<Button type="primary" className="w-full" disabled={loading} htmlType="submit">
					{loading ? '登录中...' : '登录'}
				</Button>
			</form>

			<div className="mt-6 text-center text-sm text-gray-500">
				<a href="/" className="hover:text-gray-700">
					返回首页
				</a>
			</div>
		</div>
	);
}
