import { Injectable } from "@nestjs/common";
import { CreateRiderDto } from "./dto/create-rider.dto";
import { UpdateRiderDto } from "./dto/update-rider.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../user/entities/user.entity";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { Rider } from "./entities/rider.entity";

@Injectable()
export class RiderService {
    constructor(
        @InjectRepository(Rider)
        private riderRepository: Repository<Rider>
    ) //private jwtService: JwtService
    {}
    create(createRiderDto: CreateRiderDto) {
        return "This action adds a new rider";
    }

    findAll() {
        return `This action returns all rider`;
    }

    findOne(id: number) {
        return `This action returns a #${id} rider`;
    }

    update(id: number, updateRiderDto: UpdateRiderDto) {
        return `This action updates a #${id} rider`;
    }

    remove(id: number) {
        return `This action removes a #${id} rider`;
    }
}
