# Create your models here.
from smartstudy_org_core.models.organization import OrganizationBase
from smartstudy_org_core.models.organization_role import OrganizationRoleBase
from smartstudy_org_core.models.organization_membership import OrganizationMembershipBase

from smartstudy_org_core.models.organization_unit import OrganizationUnitBase
from smartstudy_org_core.models.organization_unit_role import OrganizationUnitRoleBase
from smartstudy_org_core.models.organization_unit_membership import OrganizationUnitMembershipBase


class Organization(OrganizationBase):
    def __str__(self) -> str:
        return f"({self.pk}) - {self.name}"


class OrganizationRole(OrganizationRoleBase):
    def __str__(self):
        return f"({self.pk}) - {self.name}"


class OrganizationMembership(OrganizationMembershipBase):
    def __str__(self) -> str:
        return f"({self.pk}) - {self.person.first_name} {self.person.last_name}"


class OrganizationUnit(OrganizationUnitBase):
    pass


class OrganizationUnitRole(OrganizationUnitRoleBase):
    pass


class OrganizationUnitMembership(OrganizationUnitMembershipBase):
    pass
