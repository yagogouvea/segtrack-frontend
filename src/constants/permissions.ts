export const PERMISSIONS = [
  "view_dashboard",
  "view_ocorrencias",
  "create_ocorrencias",
  "edit_ocorrencias_24h",
  "view_prestadores",
  "edit_prestadores",
  "view_relatorios",
  "edit_relatorios",
  "download_pdf",
  "manage_clientes",
  "manage_usuarios",
  "view_financeiro"
];

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  operador: [
    "view_dashboard",
    "view_ocorrencias",
    "create_ocorrencias",
    "edit_ocorrencias_24h",
    "view_prestadores",
    "view_relatorios",
    "download_pdf"
  ],
  supervisor: [
    "view_dashboard",
    "view_ocorrencias",
    "create_ocorrencias",
    "edit_ocorrencias_24h",
    "view_prestadores",
    "edit_prestadores",
    "view_relatorios",
    "edit_relatorios",
    "download_pdf"
  ],
  admin: [...PERMISSIONS]
};
