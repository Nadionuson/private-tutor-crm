import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow } from 'date-fns'
import { pt } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(amount)
}

export function formatDate(date: string | null): string {
  if (!date) return '—'
  return format(new Date(date), 'dd MMM yyyy', { locale: pt })
}

export function formatDateTime(date: string | null): string {
  if (!date) return '—'
  return format(new Date(date), 'dd MMM · HH:mm', { locale: pt })
}

export function formatRelative(date: string | null): string {
  if (!date) return '—'
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: pt })
}

export function lessonCost(durationMinutes: number, ratePerHour: number): number {
  return (durationMinutes / 60) * ratePerHour
}

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const AVATAR_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#06b6d4',
  '#f59e0b', '#22c55e', '#ef4444', '#3b82f6',
]

export function avatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}
