// lib/api/travellersApi.ts
import { nextServer } from './api';

export type Traveller = {
  id: string;
  _id: string;
  name: string;
  avatarUrl?: string;
  description?: string;
  articlesAmount?: number;
  raw?: unknown;
};

export type FetchTravellersParams = {
  perPage: number;
  page: number;
};

export type PaginationResult = {
  data: Traveller[];
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  page: number;
  perPage: number;
};

export type FetchTravellersResponse = PaginationResult;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getStringFromKeys(
  obj: Record<string, unknown>,
  keys: string[]
): string | undefined {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === 'string' && v.trim().length > 0) {
      return v;
    }
  }
  return undefined;
}

function getNumberFromKeys(
  obj: Record<string, unknown>,
  keys: string[]
): number | undefined {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === 'number') {
      return v;
    }
  }
  return undefined;
}

function normalizeRaw(raw: unknown, fallbackIndex: number): Traveller {
  let id = `generated-${Date.now()}-${fallbackIndex}`;
  let _id = '';
  let name = '';
  let avatarUrl: string | undefined = undefined;
  let description: string | undefined = undefined;
  let articlesAmount: number | undefined = undefined;

  if (isObject(raw)) {
    const raw_id_field = raw['_id'];
    const raw_id_alt = raw['id'];

    if (typeof raw_id_field === 'string' && raw_id_field.length > 0) {
      _id = raw_id_field;
    } else if (
      isObject(raw_id_field) &&
      typeof raw_id_field['$oid'] === 'string' &&
      raw_id_field['$oid'].length > 0
    ) {
      _id = raw_id_field['$oid'];
    }

    if (_id.length > 0) {
      id = _id;
    } else if (typeof raw_id_alt === 'string' && raw_id_alt.length > 0) {
      id = raw_id_alt;
    }

    if (_id.length === 0) {
      _id = id;
    }

    name =
      getStringFromKeys(raw, ['name', 'title', 'fullName']) ??
      getStringFromKeys(raw, ['username', 'label']) ??
      '';

    avatarUrl = getStringFromKeys(raw, ['avatar', 'avatarUrl', 'img', 'image']);

    description = getStringFromKeys(raw, [
      'description',
      'article',
      'bio',
      'about',
    ]);

    articlesAmount = getNumberFromKeys(raw, ['articlesAmount']);
  }

  return {
    id,
    _id,
    name,
    avatarUrl,
    description,
    articlesAmount,
    raw,
  };
}

/* Fetch travellers from backend using page+perPage pagination */
export async function fetchTravellers(
  params: FetchTravellersParams
): Promise<FetchTravellersResponse> {
  try {
    const res = await nextServer.get('/users', {
      params: {
        perPage: params.perPage,
        page: params.page,
      },
    });

    const payload: unknown = res.data;

    const paginationResult = isObject(payload) ? payload.data : null;

    let items: unknown[] = [];

    if (isObject(paginationResult) && Array.isArray(paginationResult.data)) {
      items = paginationResult.data;

      const totalItems =
        typeof paginationResult.totalItems === 'number'
          ? paginationResult.totalItems
          : 0;
      const totalPages =
        typeof paginationResult.totalPages === 'number'
          ? paginationResult.totalPages
          : 1;
      const hasNextPage =
        typeof paginationResult.hasNextPage === 'boolean'
          ? paginationResult.hasNextPage
          : false;
      const hasPreviousPage =
        typeof paginationResult.hasPreviousPage === 'boolean'
          ? paginationResult.hasPreviousPage
          : false;
      const currentPage =
        typeof paginationResult.page === 'number'
          ? paginationResult.page
          : params.page;
      const currentPerPage =
        typeof paginationResult.perPage === 'number'
          ? paginationResult.perPage
          : params.perPage;

      const normalized = items.map((it, idx) => normalizeRaw(it, idx));

      return {
        data: normalized,
        totalItems: totalItems,
        totalPages: totalPages,
        hasNextPage: hasNextPage,
        hasPreviousPage: hasPreviousPage,
        page: currentPage,
        perPage: currentPerPage,
      };
    }

    return {
      data: [],
      totalItems: 0,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
      page: params.page,
      perPage: params.perPage,
    };
  } catch (error) {
    throw error;
  }
}

/* Fetch a single traveller by ID */
export async function getTravellerById(id: string): Promise<Traveller | null> {
  try {
    const res = await nextServer.get(`/users/${id}`);

    // 1. Перевірка, чи отримано дані
    if (!res.data) {
      return null;
    }

    const payload = res.data;

    // 2. 🚀 ВИПРАВЛЕННЯ: Доступ до вкладеного об'єкта user
    const rawUserData =
      isObject(payload) && isObject(payload.data)
        ? payload.data.user // Отримуємо об'єкт user з data.user
        : null;

    if (!rawUserData) {
      return null;
    }

    // 3. Нормалізація
    return normalizeRaw(rawUserData, 0);
  } catch (error) {
    console.error(`Error fetching traveller ${id}:`, error);
    return null;
  }
}
