from pydantic import BaseModel
from typing import List, Literal, Optional
from datetime import datetime


# Risk levels matching frontend types
RiskLevel = Literal['Low', 'Moderate', 'Critical', 'Stable']
SignalStatus = Literal['Open', 'Investigating', 'Resolved']
ZoneCategory = Literal['Safety', 'IT', 'Facilities', 'General']
UserType = Literal['Admin', 'Student', 'Management']


class Signal(BaseModel):
    id: str
    title: str
    category: str
    location: str
    timestamp: str  # ISO or relative string
    riskLevel: RiskLevel
    description: str
    status: SignalStatus


class SignalCreate(BaseModel):
    title: str
    category: str
    location: str
    riskLevel: RiskLevel
    description: str


class SignalStatusUpdate(BaseModel):
    status: SignalStatus


class Coordinates(BaseModel):
    x: float
    y: float


class Zone(BaseModel):
    id: str
    name: str
    category: ZoneCategory
    riskLevel: RiskLevel
    signalCount: int
    coordinates: Coordinates
    latLng: List[float]  # [lat, lng]
    details: str


class ZoneUpdate(BaseModel):
    riskLevel: Optional[RiskLevel] = None
    signalCount: Optional[int] = None
    details: Optional[str] = None


class Stats(BaseModel):
    healthScore: int
    activeSignals: int
    trend: List[int]


class User(BaseModel):
    name: str
    role: str
    avatar: str
    email: str
    department: str
    idString: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    department: Optional[str] = None


class Notification(BaseModel):
    id: int
    title: str
    time: str
    read: bool


class NotificationReadUpdate(BaseModel):
    read: bool = True
