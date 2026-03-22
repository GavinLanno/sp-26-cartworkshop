using AutoMapper;
using backend.DTOs;
using backend.Models;

namespace backend.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Cart, CartResponse>()
            .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.Items))
            .ForMember(dest => dest.TotalItems, opt => opt.MapFrom(src => src.Items.Sum(item => item.Quantity)))
            .ForMember(dest => dest.Subtotal, opt => opt.MapFrom(src => src.Items.Sum(item => item.Product.Price * item.Quantity)))
            .ForMember(dest => dest.Total, opt => opt.MapFrom(src => src.Items.Sum(item => item.Product.Price * item.Quantity)));

        CreateMap<CartItem, CartItemResponse>()
            .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.Name))
            .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Product.Price))
            .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => src.Product.ImageUrl))
            .ForMember(dest => dest.LineTotal, opt => opt.MapFrom(src => src.Product.Price * src.Quantity));
    }
}
