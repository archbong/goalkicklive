export function getPaginationParams(req: Request) {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") ?? "1", 10);
  const limit = Math.min(
    50,
    parseInt(url.searchParams.get("limit") ?? "20", 10),
  );
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}
export function getPaginationHeaders(
  total: number,
  page: number,
  limit: number,
) {
  const totalPages = Math.ceil(total / limit);
  return {
    "X-Total-Count": total.toString(),
    "X-Total-Pages": totalPages.toString(),
    "X-Current-Page": page.toString(),
    "X-Limit": limit.toString(),
  };
}
export function getPaginationLinks(
  baseUrl: string,
  page: number,
  totalPages: number,
) {
  const links = [];
  if (page > 1) {
    links.push(`<${baseUrl}?page=${page - 1}>; rel="prev"`);
  }
  if (page < totalPages) {
    links.push(`<${baseUrl}?page=${page + 1}>; rel="next"`);
  }
  return links.join(", ");
}
export function getPaginationResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
) {
  const totalPages = Math.ceil(total / limit);
  return {
    data,
    pagination: {
      total,
      totalPages,
      currentPage: page,
      limit,
    },
    headers: getPaginationHeaders(total, page, limit),
  };
}
