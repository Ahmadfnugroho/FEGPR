import { z } from "zod";

export const bookingSchema = z.object({
  name: z.string().min(1, "Nama Wajib Diisi"),
  email: z.string().email("Email Tidak Valid"),
  phone: z.string().min(1, "Nomor Telepon Wajib Diisi"),
  start_date: z.string().min(1, "Tanggal Sewa Wajib Diisi"),
  duration: z.string().min(1, "Durasi Sewa Wajib Diisi"),
  quantity: z.string().min(1, "Jumlah Sewa Wajib Diisi"),
  product_id: z.string().min(1, "Product Wajib Dipilih"),
});

export const viewBookingSchema = z.object({
  booking_trx_id: z.string().min(1, "Booking TRX Wajib Diisi"),
  phone_number: z.string().min(1, "Nomor Telepon Wajib Diisi"),
});
