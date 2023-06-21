import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { Role } from "../person/entities/person.entity";
import { JwtAuthGuard } from "../jwt/jwt-auth.guard";
import { RolesGuard } from "../guards/roles.guard";

export function Auth(role: Role) {
    return applyDecorators(
        SetMetadata("role", role),
        UseGuards(JwtAuthGuard, RolesGuard)
    );
}
