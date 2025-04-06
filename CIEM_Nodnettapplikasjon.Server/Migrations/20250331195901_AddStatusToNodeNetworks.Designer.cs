﻿// <auto-generated />
using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace CIEM_Nodnettapplikasjon.Server.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20250331195901_AddStatusToNodeNetworks")]
    partial class AddStatusToNodeNetworks
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.1")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("CIEM_Nodnettapplikasjon.Server.Database.Models.Actors.ActorModel", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("ActorType")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Category")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Description")
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.PrimitiveCollection<List<string>>("SubActors")
                        .HasColumnType("text[]");

                    b.HasKey("Id");

                    b.ToTable("Actors");
                });

            modelBuilder.Entity("CIEM_Nodnettapplikasjon.Server.Database.Models.NodeNetworks.NodeNetworksModel", b =>
                {
                    b.Property<int>("networkID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("networkID"));

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTimeOffset>("time_of_creation")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("networkID");

                    b.ToTable("NodeNetworks");
                });

            modelBuilder.Entity("CIEM_Nodnettapplikasjon.Server.Database.Models.Nodes.NodesModel", b =>
                {
                    b.Property<int>("nodeID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("nodeID"));

                    b.Property<int>("layer")
                        .HasColumnType("integer");

                    b.Property<string>("name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("networkID")
                        .HasColumnType("integer");

                    b.HasKey("nodeID");

                    b.HasIndex("networkID");

                    b.ToTable("Nodes");
                });

            modelBuilder.Entity("CIEM_Nodnettapplikasjon.Server.Models.Users.UserModel", b =>
                {
                    b.Property<int>("UserID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("UserID"));

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Phone")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Role")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("UserID");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("CIEM_Nodnettapplikasjon.Server.Database.Models.Nodes.NodesModel", b =>
                {
                    b.HasOne("CIEM_Nodnettapplikasjon.Server.Database.Models.NodeNetworks.NodeNetworksModel", "NodeNetwork")
                        .WithMany("Nodes")
                        .HasForeignKey("networkID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("NodeNetwork");
                });

            modelBuilder.Entity("CIEM_Nodnettapplikasjon.Server.Database.Models.NodeNetworks.NodeNetworksModel", b =>
                {
                    b.Navigation("Nodes");
                });
#pragma warning restore 612, 618
        }
    }
}
