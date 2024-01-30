import { Pipe, PipeTransform } from "@angular/core";
import { AuthoringApiService } from "../../services/authoringApi/authoring-api.service";

@Pipe({
  name: 'orgRole'
})
export class OrganizationRolePipe implements PipeTransform {
  constructor(
    private _apiService: AuthoringApiService
  ) { }

  transform(value: number): string {
    return this._apiService.contextService.organizationRoles.find(
      r => r.id === value
    )?.name ?? "unknown";
  }
}