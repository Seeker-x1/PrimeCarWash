import type { Vehicle } from "@/constants/vehicles";
import type { Locale } from "@/lib/site-content";

export function getVehicleBrand(vehicle: Vehicle, locale: Locale): string {
  return locale === "en" ? (vehicle.brandEn ?? vehicle.brand) : vehicle.brand;
}

export function getVehicleModel(vehicle: Vehicle, locale: Locale): string {
  return locale === "en" ? (vehicle.modelEn ?? vehicle.model) : vehicle.model;
}

export function getVehicleLabel(vehicle: Vehicle, locale: Locale): string {
  return `${getVehicleBrand(vehicle, locale)} / ${getVehicleModel(vehicle, locale)}`;
}

export function getVehicleFullName(vehicle: Vehicle, locale: Locale): string {
  return `${getVehicleBrand(vehicle, locale)} ${getVehicleModel(vehicle, locale)}`;
}
