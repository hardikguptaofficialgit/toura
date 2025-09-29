// Lightweight localStorage-based auth and user store

export interface LocalUserRecord {
	id: string;
	email: string;
	passwordHash: string; // simple hash for obfuscation, not secure for production
	displayName: string;
	avatar?: string | null;
	bio?: string;
	phoneNumber?: string;
	createdAt: string;
	updatedAt: string;
	favorites?: any[];
	itineraries?: any[];
}

export interface SessionUser {
	uid: string;
	email: string;
	displayName: string;
	photoURL: string | null;
	emailVerified: boolean;
}

const USERS_KEY = 'toura_users_v1';
const SESSION_KEY = 'toura_session_v1';

function readUsers(): Record<string, LocalUserRecord> {
	try {
		const raw = localStorage.getItem(USERS_KEY);
		return raw ? JSON.parse(raw) : {};
	} catch {
		return {};
	}
}

function writeUsers(users: Record<string, LocalUserRecord>) {
	localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function saveSession(user: SessionUser) {
	localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function getSession(): SessionUser | null {
	try {
		const raw = localStorage.getItem(SESSION_KEY);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}

export function clearSession() {
	localStorage.removeItem(SESSION_KEY);
}

function simpleHash(input: string): string {
	let hash = 0;
	for (let i = 0; i < input.length; i++) {
		hash = (hash << 5) - hash + input.charCodeAt(i);
		hash |= 0;
	}
	return String(hash);
}

function generateId(email: string): string {
	return 'user_' + Math.abs(parseInt(simpleHash(email))).toString(36) + '_' + Date.now().toString(36);
}

export async function signUpWithEmail(email: string, password: string) {
	const users = readUsers();
	const existing = Object.values(users).find(u => u.email.toLowerCase() === email.toLowerCase());
	if (existing) {
		throw new Error('Email already registered');
	}
	const id = generateId(email);
	const now = new Date().toISOString();
	const record: LocalUserRecord = {
		id,
		email,
		passwordHash: simpleHash(password),
		displayName: email.split('@')[0],
		avatar: null,
		bio: '',
		phoneNumber: '',
		createdAt: now,
		updatedAt: now,
		favorites: [],
		itineraries: []
	};
	users[id] = record;
	writeUsers(users);
	const session: SessionUser = {
		uid: id,
		email,
		displayName: record.displayName,
		photoURL: record.avatar || null,
		emailVerified: true
	};
	saveSession(session);
	return { user: session };
}

export async function signInWithEmail(email: string, password: string) {
	const users = readUsers();
	const user = Object.values(users).find(u => u.email.toLowerCase() === email.toLowerCase());
	if (!user) throw new Error('Invalid credentials');
	if (user.passwordHash !== simpleHash(password)) throw new Error('Invalid credentials');
	const session: SessionUser = {
		uid: user.id,
		email: user.email,
		displayName: user.displayName,
		photoURL: user.avatar || null,
		emailVerified: true
	};
	saveSession(session);
	return { user: session };
}

export async function signOut() {
	clearSession();
	return;
}

export async function formatUserData(sessionUser: SessionUser) {
	const users = readUsers();
	const record = users[sessionUser.uid];
	return {
		uid: sessionUser.uid,
		email: sessionUser.email,
		displayName: record?.displayName || sessionUser.displayName,
		photoURL: record?.avatar || null,
		emailVerified: true,
		phoneNumber: record?.phoneNumber || '',
		bio: record?.bio || '',
		favorites: record?.favorites || [],
		itineraries: record?.itineraries || []
	};
}

export function getUserData(userId: string): LocalUserRecord | null {
	const users = readUsers();
	return users[userId] || null;
}

export function upsertUserData(userId: string, partial: Partial<LocalUserRecord>) {
	const users = readUsers();
	const existing = users[userId];
	if (!existing) return;
	users[userId] = { ...existing, ...partial, updatedAt: new Date().toISOString() };
	writeUsers(users);
}

export function updateFavorites(userId: string, favorites: any[]) {
	upsertUserData(userId, { favorites });
}

export function updateItineraries(userId: string, itineraries: any[]) {
	upsertUserData(userId, { itineraries });
}


