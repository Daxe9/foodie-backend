import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./user/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class AppService {
    constructor() {}
}
