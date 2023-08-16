import { inject } from "@angular/core";
import { DetailedFormService } from "src/app/services/detailed-form/detailed-form.service"
import { Router } from "@angular/router";

export const DetailsGuard = () => {

  const detailedFormService = inject(DetailedFormService);
  const router = inject(Router);

  if (!detailedFormService.getForm()) {
    router.navigate(['/tabs/forms']);
  }

  try {
    detailedFormService.getLocation()
    return true;
  } catch (error) {
    alert('Por favor, activa la localización en tu dispositivo')
    return false;
  }
}
