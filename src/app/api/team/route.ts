export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const ADMIN_API_URL = process.env.ADMIN_API_URL || 'http://localhost:3001/api/players';

export async function GET() {
  // Return static team data based on the provided image
  const team = [
    { name: 'Nguyễn Thành Đạt', role: 'GK', image: 'Đạt.jfif', captain: false },
    { name: 'Lê Vũ Nhật Minh', role: 'CB', image: undefined, captain: false },
    { name: 'Nguyễn Đỗ Bảo Khánh', role: 'CB', image: 'BKhanh.jfif', captain: false },
    { name: 'Nguyễn Đức Bảo Phong', role: 'CB', image: undefined, captain: false },
    { name: 'Vũ Nhật Ninh', role: 'RB', image: undefined, captain: false },
    { name: 'Phạm Công Toàn', role: 'LB', image: undefined, captain: false },
    { name: 'Hoàng Đặng Việt Hùng', role: 'CDM', image: 'Hùng.png', captain: true },
    { name: 'Đỗ Quốc Khánh', role: 'AMF', image: undefined, captain: false },
    { name: 'Phạm Anh Phương', role: 'LW', image: 'Phương.jfif', captain: false },
    { name: 'Nguyễn Quang Minh Thành', role: 'CF', image: undefined, captain: false },
    { name: 'Đặng Minh Việt', role: 'RW', image: undefined, captain: false },
    { name: 'Trần Minh Đức', role: 'CF', image: 'Duc.jpg', captain: false },
  ];
  const playerOfTheMonth = team.find(p => p.captain) || team[0];
  return NextResponse.json({ team, playerOfTheMonth });
} 