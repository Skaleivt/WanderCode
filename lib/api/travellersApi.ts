import { nextServer } from './api';

export type Traveller = {
  id: string;
  name: string;
  avatarUrl?: string;
  description?: string;
  raw?: unknown;
};

export type FetchTravellersParams = {
  perPage: number;
  page: number;
};

// Define the structure of the data that the fetchTravellers function will return
export type PaginationResult = {
  data: Traveller[];
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  page: number;
  perPage: number;
};

// The function will return this structure
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

function normalizeRaw(raw: unknown, fallbackIndex: number): Traveller {
  let id = `generated-${Date.now()}-${fallbackIndex}`;
  let name = '';
  let avatarUrl: string | undefined = undefined;
  let description: string | undefined = undefined;

  if (isObject(raw)) {
    const _id = raw['_id'];
    if (isObject(_id)) {
      const oid = _id['$oid'];
      if (typeof oid === 'string' && oid.length > 0) id = oid;
    } else if (typeof _id === 'string' && _id.length > 0) {
      id = _id;
    } else if (typeof raw['id'] === 'string' && raw['id'].length > 0) {
      id = raw['id'];
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
  }

  return {
    id,
    name,
    avatarUrl,
    description,
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

    // Axios response data: {status: 200, message: "...", data: PaginationResult}
    const payload: unknown = res.data;

    // Extract the PaginationResult object from the outer 'data' wrapper
    const paginationResult = isObject(payload) ? payload.data : null;

    let items: unknown[] = [];

    // Check if the actual list of travellers (paginationResult.data) is an array
    if (isObject(paginationResult) && Array.isArray(paginationResult.data)) {
      items = paginationResult.data; // Now items is the array of raw travellers

      // Extract pagination details from paginationResult
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

      // Return the PaginationResult structure
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

    // Return empty result on failure to parse
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
