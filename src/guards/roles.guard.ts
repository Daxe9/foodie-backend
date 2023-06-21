import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "../person/entities/person.entity";
function matchRoles(role: Role, userRole: Role): boolean {
    return role === userRole;
}
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const role = this.reflector.get<string>(
            "role",
            context.getHandler()
        ) as Role;
        if (!role) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        return matchRoles(role, user.role);
    }
}
