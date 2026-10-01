import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ProductCategory } from './ProductCategory';
import { ProductSituation } from './ProductSituation';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name!: string;

  @Column({ type: 'int', nullable: true })
  productSituationId!: number;

  @Column({ type: 'int', nullable: true })
  productCategoryId!: number;

  @ManyToOne(() => ProductSituation)
  @JoinColumn({ name: 'productSituationId' })
  productSituation!: ProductSituation;

  @ManyToOne(() => ProductCategory)
  @JoinColumn({ name: 'productCategoryId' })
  productCategory!: ProductCategory;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
