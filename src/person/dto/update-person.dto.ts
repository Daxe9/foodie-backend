import { PartialType } from "@nestjs/mapped-types";
import { CreatePersonDto } from "../../restaurant/dto/create-person.dto";

export class UpdatePersonDto extends PartialType(CreatePersonDto) {}
