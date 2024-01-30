import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { dummyOrganizationRoles } from "src/testutils/object-mocks";
import { authoringApiServiceMock, contextServiceMock } from "src/testutils/service-mocks";
import { IOrganizationRole } from "../../models/organization_role";
import { AuthoringApiService } from "../../services/authoringApi/authoring-api.service";
import { ContextService } from "../../services/context/context.service";
import { OrganizationRolePipe } from "./organization-role.pipe";

describe('OrganizationRolePipe', () => {
  let apiService: AuthoringApiService;
  let contextService: ContextService;
  let component: OrganizationRolePipe;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, HttpClientModule],
      declarations: [OrganizationRolePipe],
      providers: [
        { provide: ContextService, use: contextServiceMock },
        { provide: AuthoringApiService, use: authoringApiServiceMock }
      ]
    });
    contextService = TestBed.inject(ContextService);
    apiService = TestBed.inject(AuthoringApiService);
  });

  beforeEach(() => {
    component = new OrganizationRolePipe(apiService);
    spyOnProperty(contextService, "organizationRoles", "get").and.returnValue(dummyOrganizationRoles);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should transform a known role ID to its corresponding string representation', () => {
    const expectedRole: IOrganizationRole = dummyOrganizationRoles[0];
    expect(component.transform(expectedRole.id)).toEqual(expectedRole.name);
  });

  it('should transform an unknown role ID to "unknown"', () => {
    expect(component.transform(-1)).toEqual("unknown");
  });
});