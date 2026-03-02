import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CollaboratorsModule } from './modules/collaborators/collaborators.module';

@Module({
  imports: [PrismaModule, CollaboratorsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
