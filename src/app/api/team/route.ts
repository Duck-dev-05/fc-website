import { NextResponse } from 'next/server';

export async function GET() {
  // Static player list with real avatars for some players
  const members = [
    { id: '1', name: 'Nguyễn Thành Đạt', role: 'GK', image: '/Avatar teams/Đạt.jfif' },
    { id: '2', name: 'Lê Vũ Nhật Minh', role: 'RB' },
    { id: '3', name: 'Nguyễn Đỗ Bảo Khánh', role: 'CB' },
    { id: '4', name: 'Nguyễn Đức Bảo Phong', role: 'CB'},
    { id: '5', name: 'Vũ Nhật Ninh', role: 'RB' },
    { id: '6', name: 'Phạm Công Toàn', role: 'LB' },
    { id: '7', name: 'Hoàng Đặng Việt Hùng', role: 'CDM', image: '/Avatar teams/Hùng.png', captain: true },
    { id: '8', name: 'Đỗ Quốc Khánh', role: 'AMF' },
    { id: '9', name: 'Phạm Anh Phương', role: 'LW', image: '/Avatar teams/Phương.jfif' },
    { id: '10', name: 'Nguyễn Quang Minh Thành', role: 'CF' },
    { id: '11', name: 'Đặng Minh Việt', role: 'RW' },
    { id: '12', name: 'Trần Minh Đức', role: 'CF' ,image: '/Avatar teams/Duc.JPG'},
  ];
  return NextResponse.json(members);
} 